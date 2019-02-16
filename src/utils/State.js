import { plural } from 'pluralize'
import _ from 'lodash'
import requestToGraphql from './requestToGraphql'

class State {
  constructor(config) {
    this.schema = config.schema
    this.parsers = config.parsers
    this.presets = config.presets
    this.createInitialState()
    this.action = this.createActions()
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

  createInitialState() {
    const stateRoots = Object.keys(this.schema)
    const actionTypes = Object.keys(this.presets)
    this.initialState = {}
    stateRoots.forEach(stateRoot => {
      this.initialState[stateRoot] = {}
      this.initialState[stateRoot][plural(stateRoot)] = []
      actionTypes.forEach(actionType => {
        this.initialState[stateRoot][actionType] = {
          loading: false,
          success: false,
          failure: true
        }
      })
    })
  }

  reducer = (state = this.initialState, action) => {
    if (action.type && (action.type in Object.keys(this.presets))) {
      const actionType = action.type.split('/')
      console.log(this.presets, action)
      return this.presets[actionType[1]]()
    }
    return state
  }

  extractDataForDispatch(data) {
    console.log(JSON.stringify(data))
  }

  query = async ({query, type, variables = {}}) => {
    const { data } = await requestToGraphql(query)
    this.extractDataForDispatch(data)
  }
}

export default State
