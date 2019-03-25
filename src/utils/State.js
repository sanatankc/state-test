import { plural } from 'pluralize'
import { get, merge, isPlainObject, cloneDeep } from 'lodash'
import { fromJS, Map } from 'immutable'
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
      return this.presets[actionType[1]](nextState, action)
    }
    return state
  }

  extractDataForDispatch(data) {
    const localSchema = {}
    console.log(data)
    const getPath = (path, key) => path
      ? `${path}.${key}`
      : key
    const getArrayX = (data, arrayXPath) => {
      const paths = arrayXPath.split('[x].').join('.').split('.')
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
      for (const key of Object.keys(data)) {
        const parsedKey = this.parser(this.schema, key)
        if (Array.isArray(data[key])) {
          if (parsedKey) {
            const mergeAllArrays = data[key].reduce((acc, next) => merge(acc, next), {})
            localSchema[parsedKey] = {
              path: getPath(path, key),
              payload: mergeAllArrays
            }
            createLocalSchema(mergeAllArrays, getPath(path, key) + '[x]')
          }
        } else if (isPlainObject(data[key])) {
          if (parsedKey) {
            localSchema[parsedKey] = {
              path: getPath(path, key),
              payload: data[key]
            }
            createLocalSchema(data[key], getPath(path, key))
          }
        }
      }
    }
    createLocalSchema(data)
    const payload = Object.keys(localSchema)
      .map(rootKey => ({
        [rootKey]: getArrayX(data, localSchema[rootKey].path)
      }))
      .reduce((acc, curr) => ({...acc, ...curr}), {})
    console.log(payload)
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

  query = async ({query, type, variables = {}, key, changeExtractedData}) => {
    try {
      this.store.dispatch({
        type: `${type}/loading`,
        key
      })
      const { data } = await requestToGraphql(query, variables)
      let extractedData = this.extractDataForDispatch(data)
      if (changeExtractedData) {
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
        key
      })
    }
  }
}

export default State
