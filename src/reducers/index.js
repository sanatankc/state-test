import { plural } from 'pluralize'
import { combineReducers } from 'redux'

const initialState = {}
const keys = ['chapter', 'topic']
const actionTypes = ['fetch', 'add']
keys.forEach(key => {
  initialState[key] = {}
  initialState[key][plural(key)] = []
  actionTypes.forEach(actionType => {
    initialState[key][actionType] = {
      loading: false,
      success: false,
      failure: true
    }
  })
})

export default combineReducers({
  data: (state = initialState, action) => state
})
