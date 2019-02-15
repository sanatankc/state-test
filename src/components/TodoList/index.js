import { connect } from 'react-redux'
import { toggleTodo, deleteTodo, toggleEditing, editTodo } from '../../actions'
import TodoList from './TodoList'

const mapStateToProps = state => ({
  todos: state.todos,
  filter: state.filter
})

const mapDispatchToProps = dispatch => ({
  toggleTodo: id => () => dispatch(toggleTodo(id)),
  deleteTodo: id => () => dispatch(deleteTodo(id)),
  toggleEditing: id => () => dispatch(toggleEditing(id)),
  editTodo: id => text => dispatch(editTodo(id, text))
})

export default connect(mapStateToProps, mapDispatchToProps)(TodoList)
