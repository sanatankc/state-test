import { plural } from 'pluralize'
import { get, merge, isPlainObject, cloneDeep } from 'lodash'
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
  }

  reducer = (state = this.initialState, action) => {
    const nextState = cloneDeep(state)
    const actionType = action.type.split('/')
    if (action.type && Object.keys(this.presets).includes(actionType[1])) {
      nextState[actionType[0]][actionType[1]][action.key] = {
        loading: actionType[2] === 'loading',
        failure: actionType[2] === 'failure',
        success: actionType[2] === 'success'
      }
      return this.presets[actionType[1]](nextState, action)
    }
    return state
  }

  extractDataForDispatch(data) {
    const localSchema = {}
    const getPath = (path, key) => path
      ? `${path}.${key}`
      : key
    const getArrayX = (data, arrayXPath) => {
      const paths = arrayXPath.split('[x].').join('.').split('.')
      let currentData = get(data, paths[0])
      for (const path of paths.splice(1)) {
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
    const collapseChildrenData = Object.keys(payload).reduce((acc, key) => ({
      ...acc,
      ...{[key]: payload[key].map(item => {
        return Object.keys(item).reduce((prev, next) => {
          if (this.parser(this.schema, next)) {
            return {
              ...prev,
              [next]: item[next].map(childItem => ({
                id: childItem.id
              }))
            }
          }
          return {...prev, [next]: item[next] }
        }, {})
      })}
    }), {})
    return collapseChildrenData
  }

  query = async ({query, type, variables = {}, key}) => {
    try {
      this.store.dispatch({
        type: `${type}/loading`,
        key
      })
      const { data } = await requestToGraphql(query, variables)
      this.store.dispatch({
        type: `${type}/success`,
        key,
        payload: {
          originalData: data,
          extractedData: this.extractDataForDispatch(data)
        }
      })
    } catch(e) {
      this.store.dispatch({
        type: `${type}/failure`,
        key
      })
      console.error(e)
    }
  }
}

export default State
