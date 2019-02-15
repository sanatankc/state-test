import { ADD_TODO } from './actionTypes'

const addTodo = text => ({
  type: ADD_TODO,
  text
})

export default addTodo
