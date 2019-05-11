import { plural } from 'pluralize'

const deleteHandler = schema => (state, action) => {
  let nextState = state
  action.payload.getIn(['extractedData']).map((val, key) => {
    if (schema.type === 'element') {
      nextState = null
    } else if (schema.type === 'object') {
      nextState = {}
    } else {
      nextState = nextState.getIn([key, 'data']).filter(item => item.get('id') !== val.get('id'))
    }
    nextState = nextState.setIn([key, plural(key)], nextState)
  })
  return nextState
}

export default deleteHandler
