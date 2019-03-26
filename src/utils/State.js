import { plural } from 'pluralize'
import { get, merge, isPlainObject, cloneDeep } from 'lodash'
import { fromJS, Map, List } from 'immutable'
import requestToGraphql from './requestToGraphql'

class State {
  constructor(config) {
    this.schema = config.schema
    this.parser = config.parser
    this.presets = config.presets
    this.createInitialState()
    this.createChildrenSchema()
    this.action = this.createActions()
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
    const actionTypes = Object.keys(this.presets)
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
    const actionTypes = Object.keys(this.presets)
    this.initialState = {}
    stateRoots.forEach(stateRoot => {
      this.initialState[stateRoot] = {}
      this.initialState[stateRoot][plural(stateRoot)] = []
      actionTypes.forEach(actionType => {
        this.initialState[stateRoot][actionType] = {}
      })
    })
    this.initialState['errors'] = {}
    this.initialState = fromJS(this.initialState)
  }

  reducer = (state = this.initialState, action) => {
    const actionType = action.type.split('/')
    let nextState = state
    if (action.type && Object.keys(this.presets).includes(actionType[1])) {
      nextState = nextState.setIn([actionType[0], actionType[1], action.key], Map({
        loading: actionType[2] === 'loading',
        failure: actionType[2] === 'failure',
        success: actionType[2] === 'success'
      }))
      if (actionType[2] === 'failure') {
        const errorKey = actionType.slice(0, -1).join('/')
        const errorKeyInErrors = nextState.getIn(['errors', errorKey])
        const errorMap = Map({
          error: action.error,
          uniqId: action.uniqId
        })
        const errorToPush = List.isList(errorKeyInErrors)
          ? errorKeyInErrors.push(errorMap)
          : List(errorMap)
        nextState = nextState.setIn(['errors', errorKey], errorToPush)
      }
      return this.presets[actionType[1]](nextState, action)
    }
  return state
}

  extractDataForDispatch(data) {
    // createLocalSchema identifies all top-level keys in nested tree
    // assigns it to localSchema
    const localSchema = {}

    const getPath = (path, key) => path
      ? `${path}.${key}`
      : key

    const getKeywisePayload = (data, keyPath) => {
      /**
       * Given path and data, it extracts keywise payload from server response.
       * Basically, what it does is tranverse through the data to find all the
       * instances of given key, merge them together and returns a payload.
       */
      const paths = keyPath.split('.')
      let currentData = get(data, paths[0])
      for (const path of paths.splice(1)) {
        currentData = Array.isArray(currentData) ? currentData : [currentData]
        let newCurrentData = currentData
          .map(data => data[path])
          .filter(data => data)
        if (Array.isArray(newCurrentData[0])) {
          newCurrentData = newCurrentData.reduce((acc, curr) => [...acc, ...curr], [])
        }
        currentData = newCurrentData
      }
      return currentData
    }

    const createLocalSchema = (data, path='') => {
      /**
       * Recursively tranverses through server payload to find all
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
      // (Because this is a revursive function
      // all keys on children will be top-level key on each
      // recursive operation)
      for (const key of Object.keys(data)) {
        // Checks if the value is either object or array
        if (Array.isArray(data[key]) || isPlainObject(data[key])) {
          // parses root key to check whether it is present in schema
          const parsedKey = this.parser(this.schema, key)
          if (parsedKey) {
            // merges all arrays to combine all possible key props
            // (if the prop value is array of objects)
            const mergeAllArrays = Array.isArray(data[key])
              ? data[key].reduce((acc, next) => merge(acc, next), {})
              : data[key]
            // sets in localSchema
            localSchema[parsedKey] = {
              path: getPath(path, key),
              payload: mergeAllArrays
            }
            // calls function recursively
            createLocalSchema(mergeAllArrays, `${getPath(path, key)}`)
          }
        }
      }
    }

    createLocalSchema(data)
    // converts localSchema to seperate payloads
    const payload = Object.keys(localSchema)
      .map(rootKey => ({
        [rootKey]: getKeywisePayload(data, localSchema[rootKey].path)
      }))
      .reduce((acc, curr) => ({...acc, ...curr}), {})

    // collapses children's data and apart from id as refrence
    // --> This could be merged with getKeywisePayload
    // Also ❌ @TODO --> children should also have parent's data
    const collapseChildrenData = Object.keys(payload).reduce((acc, key) => {
      const collapseItem = item => Object.keys(item).reduce((prev, next) => {
        if (item[next] && this.parser(this.schema, next)) {
          return {
            ...prev,
            [next]: Array.isArray(item[next])
              ? item[next].map(childItem => ({
                  id: childItem.id
                }))
              : { id: item[next].id }
          }
        }
        return {...prev, [next]: item[next] }
      }, {})
      return {
      ...acc,
      ...{[key]: Array.isArray(payload[key])
          ? payload[key].map(item => collapseItem(item))
          : collapseItem(payload[key])
      }
    }}, {})
    return collapseChildrenData
  }

  query = async ({query, type, variables = {}, key, changeExtractedData, uniqId = null}) => {
    try {
      this.store.dispatch({
        type: `${type}/loading`,
        key
      })
      const { data } = await requestToGraphql(query, variables)
      let extractedData = this.extractDataForDispatch(data)
      if (changeExtractedData) {
        // changeExtractedData changes nested payload to
        // flat with refrences
        extractedData = changeExtractedData(extractedData, data, type.split('/')[0])
      }
      this.store.dispatch({
        type: `${type}/success`,
        key,
        payload: fromJS({
          originalData: data,
          extractedData
        })
      })
    } catch(e) {
      console.error(e)
      this.store.dispatch({
        type: `${type}/failure`,
        error: e,
        key,
        uniqId
      })
    }
  }
}

export default State
