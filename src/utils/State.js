import { plural } from 'pluralize'

class State {
  constructor(config) {
    this.schema = config.schema
    this.parsers = config.parsers
    this.presets = config.presets
    this.createInitialState()
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
}

export default State
