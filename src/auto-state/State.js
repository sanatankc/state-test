import { plural } from 'pluralize'
import { get, merge, isPlainObject } from 'lodash'
import { fromJS, Map, List } from 'immutable'
import { getDataById } from './data-utils'
import handlers from './handlers'

const flatAndMergePayload = payload => {
  const mergedPayload = {}
  for (const items of payload) {
    for (const item of items) {
      for (const key of Object.keys(item)) {
        if (!Array.isArray(item[key]) || item[key].length) {
          if (mergedPayload[key]) {
            if (Array.isArray(item[key])) {
              mergedPayload[key] = [...mergedPayload[key], ...item[key]]
            } else {
              mergedPayload[key].push(item[key])
            }
          } else {
            mergedPayload[key] = item[key]
          }
        }
      }
    }
  }
  return mergedPayload
}

const mergeDuplicates = arr =>
  arr.reduce((acc, current) => {
    const x = acc.findIndex(item => item.id === current.id)
    if (x === -1) {
      return acc.concat([current])
    }
    acc[x] = { ...acc[x], ...current }
    return acc
  }, [])

class State {
  constructor(config) {
    this.schema = config.schema
    this.customInitialState = config.customInitialState
    this.createInitialState()
    this.createChildrenSchema()
    this.createPossibleRootKeys()
    this.requestToGraphql = config.graphqlLib
    this.overrideAutoReducers = {}
    this.action = this.createActions()
  }

  createPossibleRootKeys() {
    const rootKeys = Object.keys(this.schema)
    const aliases = Object.keys(this.schema)
      .map(schemaKey => (this.schema[schemaKey].alias ? this.schema[schemaKey].alias : []))
      .reduce((prev, curr) => [...prev, ...curr], [])
    this.possibleRootKeys = [...rootKeys, ...aliases]
  }
  parser(key) {
    for (const schemaKey in this.schema) {
      if (schemaKey === key) return schemaKey
      if (this.schema[schemaKey].alias) {
        for (const aliasKey of this.schema[schemaKey].alias) {
          if (aliasKey === key) return schemaKey
        }
      }
    }
    return null
  }
  createChildrenSchema() {
    this.childrenSchema = Object.keys(this.schema).reduce((prev, next) => {
      const childSchema = prev
      if (this.schema[next].children) {
        this.schema[next].children.forEach(child => {
          if (childSchema[child] && childSchema[child].parent) {
            childSchema[child].parent.push(next)
          } else {
            childSchema[child] = {
              parent: [next]
            }
          }
        })
      }
      return childSchema
    }, {})
  }

  createActions() {
    const stateRoots = Object.keys(this.schema)
    const actionTypes = Object.keys(handlers)
    return stateRoots
      .map(stateRoot => actionTypes.map(actionType => `${stateRoot}/${actionType}`))
      .reduce((prev, curr) => prev.concat(curr))
      .reduce((prev, curr) => {
        const keyName = curr.split('/')
        keyName[1] = keyName[1].charAt(0).toUpperCase() + keyName[1].slice(1)
        return {
          ...prev,
          [keyName.join('')]: curr
        }
      }, {})
  }

  registerStore(store) {
    this.store = store
  }

  createInitialState() {
    const stateRoots = Object.keys(this.schema)
    const actionTypes = Object.keys(handlers)
    this.initialState = {}
    stateRoots.forEach(stateRoot => {
      this.initialState[stateRoot] = {}
      const rootType = this.schema[stateRoot].type
      if (rootType === 'arrayOfObjects') {
        this.initialState[stateRoot].data = []
      } else if (rootType === 'object') {
        this.initialState[stateRoot].data = {}
      } else {
        this.initialState[stateRoot].data = null
      }
      actionTypes.forEach(actionType => {
        this.initialState[stateRoot][`${actionType}Status`] = {}
      })
    })
    this.initialState.errors = {}
    this.initialState = { ...this.initialState, ...this.customInitialState }
    this.initialState = fromJS(this.initialState)
  }

  reducer = (state = this.initialState, action) => {
    const actionType = action.type.split('/')
    let nextState = state
    if (action.type && action.autoReducer) {
      nextState = nextState.setIn(
        [actionType[0], `${actionType[1]}Status`, action.key || 'root'],
        Map({
          loading: actionType[2] === 'loading',
          failure: actionType[2] === 'failure',
          success: actionType[2] === 'success'
        })
      )
      if (actionType[2] === 'failure') {
        const errorKey = actionType.slice(0, -1).join('/')
        const errorKeyInErrors = nextState.getIn(['errors', errorKey])
        const errorMap = Map({
          error: action.error,
          uniqId: action.uniqId
        })
        const errorToPush = List.isList(errorKeyInErrors)
          ? errorKeyInErrors.push(errorMap)
          : List([errorMap])
        nextState = nextState.setIn(['errors', errorKey], errorToPush)
      }
      if (action.overrideAutoReducer) {
        const overrideReducer = this.overrideAutoReducers[action.uniqueId]
        return overrideReducer(nextState, action)
      }
      return handlers[actionType[1]](this.schema)(nextState, action)
    }
    return state
  }

  extractDataForDispatch(data) {
    // createLocalSchema identifies all top-level keys in nested tree
    // assigns it to localSchema
    const localSchema = {}

    const getPath = (path, key) => (path ? `${path}.${key}` : key)

    const getKeywisePayload = (data, keyPath, rootKey) => {
      /**
       * Given path and data, it extracts keywise payload from server response.
       * Basically, what it does is traverse through the data to find all the
       * instances of given key, merge them together and returns a payload.
       */
      const paths = keyPath.split('.')
      let currentData = get(data, paths[0])
      for (const path of paths.splice(1)) {
        currentData = Array.isArray(currentData) ? currentData : [currentData]
        let newCurrentData = currentData.map(data => data[path]).filter(data => data)
        if (Array.isArray(newCurrentData[0])) {
          newCurrentData = newCurrentData.reduce((acc, curr) => [...acc, ...curr], [])
        }
        const rootKeyType = this.schema[rootKey].type
        if (rootKeyType === 'element' || rootKeyType === 'object') {
          newCurrentData = newCurrentData[0]
        }
        currentData = newCurrentData
      }
      return currentData
    }

    const createLocalSchema = (data, path = '') => {
      /**
       * Recursively traverses through server payload to find all
       * root-level keys from schema and assigns them to localSchema
       */

      /**
       * if
       *   data = {
       *     chapters: {
       *       id: 0,
       *       title: 'A B C'
       *       topics: [
       *         {
       *           id: 0,
       *           title: 'B C D',
       *           learningObjective: {
       *             id: 3
       *           }
       *         },
       *         {
       *           id: 1,
       *           title: 'C C D'
       *         }
       *       ]
       *     }
       *   }
       *
       * then
       *   on createLocalSchema(data)
       *   localSchema becomes --> {
       *     chapters: {
       *       path: 'chapters',
       *       ...payload
       *     },
       *     topics: {
       *       path: 'chapters.topics'
       *       ...payload
       *     },
       *     learningObjective: {
       *       path: 'chapters.topics.learningObjective'
       *       ...payload
       *     }
       *   }
       *
       */
      // This👇 loops through all keys in top level root
      // (Because this is a recursive function
      // all keys on children will be top-level key on each
      // recursive operation)
      for (const key of Object.keys(data)) {
        // Checks if the value is either object or array or
        // possibly could be one of the root keys or aliases
        if (
          Array.isArray(data[key]) ||
          isPlainObject(data[key]) ||
          this.possibleRootKeys.includes(key)
        ) {
          // parses root key to check whether it is present in schema
          const parsedKey = this.parser(key)
          // merges all arrays to combine all possible key props
          // (if the prop value is array of objects)
          const mergeAllArrays = Array.isArray(data[key])
            ? data[key].reduce((acc, next) => merge(acc, next), {})
            : data[key]
          if (parsedKey) {
            // sets in localSchema
            if (localSchema[parsedKey]) {
              localSchema[parsedKey].push({
                path: getPath(path, key),
                payload: mergeAllArrays
              })
            } else {
              localSchema[parsedKey] = [
                {
                  path: getPath(path, key),
                  payload: mergeAllArrays
                }
              ]
            }
          }
          // calls function recursively
          if (isPlainObject(mergeAllArrays)) {
            createLocalSchema(mergeAllArrays, `${getPath(path, key)}`)
          }
        }
      }
    }
    createLocalSchema(data)
    // converts localSchema to separate payloads
    let payload = Object.keys(localSchema).map(rootKey =>
      localSchema[rootKey].map(item => ({
        [rootKey]: getKeywisePayload(data, item.path, rootKey)
      }))
    )
    // merge all keys with same name and flat array of objects to object
    payload = flatAndMergePayload(payload)
    // mergeAllDuplicates with same ids
    payload = Object.keys(payload).reduce((acc, key) => {
      acc[key] = mergeDuplicates(payload[key])
      return acc
    }, {})

    // collapses children's data and apart from id as reference
    // --> This could be merged with getKeywisePayload
    let collapseChildrenData = Object.keys(payload).reduce((acc, key) => {
      const collapseItem = item =>
        Object.keys(item).reduce((prev, next) => {
          if (item[next] && this.parser(next)) {
            return {
              ...prev,
              [next]: Array.isArray(item[next])
                ? item[next].map(childItem => ({
                  id: childItem.id
                }))
                : { id: item[next].id }
            }
          }
          return { ...prev, [next]: item[next] }
        }, {})
      return {
        ...acc,
        ...{
          [key]: Array.isArray(payload[key])
            ? payload[key].map(item => collapseItem(item))
            : this.schema[key].type === 'element'
              ? payload[key]
              : collapseItem(payload[key])
        }
      }
    }, {})
    const updateParentReference = (data, key, parentKey) => {
      for (const parentItem of data[parentKey]) {
        let childReferenceInParentItem = parentItem[plural(key)] || parentItem[key]
        if (!childReferenceInParentItem) return data
        childReferenceInParentItem = Array.isArray(childReferenceInParentItem)
          ? childReferenceInParentItem
          : [childReferenceInParentItem]
        for (const item of childReferenceInParentItem) {
          const childItem = getDataById(data[key], item.id)
          if (childItem) {
            data[key] = data[key].map(item => {
              if (item.id === childItem.id) {
                if (item[plural(parentKey)]) {
                  return {
                    ...item,
                    [plural(parentKey)]: [...parentKey, { id: parentItem.id }]
                  }
                }
                return {
                  ...item,
                  [plural(parentKey)]: [{ id: parentItem.id }]
                }
              }
              return item
            })
          }
        }
      }
      return data
    }

    for (const key in collapseChildrenData) {
      if (Object.keys(this.childrenSchema).includes(key)) {
        const parentKeys = this.childrenSchema[key].parent
        for (const parentKey of parentKeys) {
          if (Object.keys(collapseChildrenData).includes(parentKey)) {
            collapseChildrenData = updateParentReference(collapseChildrenData, key, parentKey)
          }
        }
      }
    }
    return collapseChildrenData
  }

  query = async ({
    query,
    type,
    variables = {},
    key = 'root',
    changeExtractedData,
    overrideAutoReducer = null,
    uniqId = null
  }) => {
    try {
      this.store.dispatch({
        type: `${type}/loading`,
        key,
        autoReducer: true
      })
      const { data } = await this.requestToGraphql(query, variables)
      let extractedData = this.extractDataForDispatch(data)
      if (changeExtractedData) {
        // changeExtractedData changes nested payload to
        // flat with references
        extractedData = changeExtractedData(extractedData, data, type.split('/')[0])
      }
      /**
       * Every action has a uniqueId attached to it.
       * Because basically when we call duck.query we are calling
       * an action and we can't send our overrideAutoReducer function
       * because action should not have a function.
       * So what we do instead is we assign our overrideAutoReducer
       * in this.overrideAutoReducers, which is basically an object
       * which contains overrideAutoReducer functions as a value to
       * uniqueId key. And we also dispatch our unique id with action.
       * That way reducer can lookup to this.overrideAutoReducers and check
       * if there is a function for uniqueId dispatched with action. And if
       * there is, it overrides the auto reducer.
       */
      const uniqueId = Math.random()
        .toString(36)
        .substr(2, 9)
      if (overrideAutoReducer) {
        this.overrideAutoReducers[uniqueId] = overrideAutoReducer
      }
      this.store.dispatch({
        autoReducer: true,
        type: `${type}/success`,
        key,
        payload: fromJS({
          originalData: data,
          extractedData
        }),
        overrideAutoReducer: !!overrideAutoReducer,
        uniqueId
      })
      return data
    } catch (e) {
      console.error(e)
      this.store.dispatch({
        type: `${type}/failure`,
        error: e,
        autoReducer: true,
        key,
        uniqId
      })
    }
  }
}

export default State
