import { EDIT_TODO } from './actionTypes'

const editTodo = (id, text) => ({
  type: EDIT_TODO,
  id,
  text
})

export default editTodo
