import { DELETE_TODO } from './actionTypes'

const deleteTodo = id => ({
  type: DELETE_TODO,
  id
})

export default deleteTodo
