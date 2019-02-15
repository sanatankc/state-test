import { ADD_TODO, TOGGLE_TODO, DELETE_TODO, TOGGLE_EDITING, EDIT_TODO } from '../../actions/actionTypes'

const todos = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      // calculates maximum todoId which has been assingned
      // NOTE: after mapping through list with only item.id
      // it uses "..." (destructuring) as Math.max does not
      // expects a list
      const maxTodoId =
        state.length === 0
          ? 0
          : Math.max(...state.map(item => item.id))
      // returns a new state with new todoitem
      return [
        ...state,
        {
          id: maxTodoId + 1,
          text: action.text,
          completed: false,
          isEditing: false
        }
      ]
    case TOGGLE_TODO:
      // returns a new state with toggling boolean value of completed
      // maps through the item toggle completed value, if todo.id is
      // equal to action.id
      return state.map(todo =>
        (todo.id === action.id)
          ? {...todo, completed: !todo.completed}
          : todo
      )

    case DELETE_TODO:
      // returns new state with filtering deleted todo from state
      // deletes todo if action.id is equal to todo.id
      return state.filter(todo => todo.id !== action.id)

    case TOGGLE_EDITING:
      // returns a new state with toggling boolean value of isEditing
      // maps through the item toggle isEditing value, if todo.id is
      // equal to action.id
      return state.map(todo =>
        (todo.id === action.id)
          ? {...todo, isEditing: !todo.isEditing}
          : todo
      )

    case EDIT_TODO:
      // returns a new state with changing text of todo. It maps
      // through the item and changes value of text, if todo.id is
      // equal to action.id
      return state.map(todo =>
        (todo.id === action.id)
          ? {...todo, text: action.text}
          : todo
      )


    default:
      return state
  }
}

export default todos
