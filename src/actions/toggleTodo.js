import { TOGGLE_TODO } from './actionTypes'

const toggleTodo = id => ({
  type: TOGGLE_TODO,
  id
})

export default toggleTodo
