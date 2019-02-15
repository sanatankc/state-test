import React from 'react'
import PropTypes from 'prop-types'
import TodoItem from '../TodoItem'
import List from './TodoList.style'

// uses currying to return a function for flter method
const filterTodo = filter => todo => filter === 'ALL'
  || (filter === 'ACTIVE' && todo.completed === false)
  || (filter === 'COMPLETED' && todo.completed === true)

/**
 * todos: list of todo items
 * filter: visiblity filter to filter todos
 * toggleTodo: function to toggle status of a todoitem from store
 * deleteTodo: function to delete an todoitem form store
 * editTodo: function to edit a todoitem
 */
const TodoList = ({ todos, filter, toggleTodo, deleteTodo, toggleEditing, editTodo }) => (
  <List>
    <List.Wrapper>
      {todos
        .filter(filterTodo(filter)).map(todo =>
          <TodoItem
            {...todo}
            key={todo.id}
            toggleTodo={toggleTodo(todo.id)}
            deleteTodo={deleteTodo(todo.id)}
            toggleEditing={toggleEditing(todo.id)}
            editTodo={editTodo(todo.id)}
          />
        )
      }
    </List.Wrapper>
  </List>
)

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired,
      isEditing: PropTypes.bool.isRequired
    }).isRequired
  ).isRequired,
  filter: PropTypes.oneOf(['ALL', 'ACTIVE', 'COMPLETED']).isRequired,
  toggleTodo: PropTypes.func.isRequired,
  toggleEditing: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  editTodo: PropTypes.func.isRequired
}

export default TodoList
