import fetchAddUpdateHandler from './fetchAddUpdate'
import deleteHandler from './delete'

const onSuccessTypeAction = handler => schema => (state, action) => {
  // Checks if action is successful.
  let nextState = state
  if (action.type.split('/')[2] === 'success') {
    nextState = handler(schema)(state, action)
  }
  return nextState
}

export default {
  fetch: onSuccessTypeAction(fetchAddUpdateHandler),
  merge: onSuccessTypeAction(fetchAddUpdateHandler),
  add: onSuccessTypeAction(fetchAddUpdateHandler),
  update: onSuccessTypeAction(fetchAddUpdateHandler),
  delete: onSuccessTypeAction(deleteHandler)
}
