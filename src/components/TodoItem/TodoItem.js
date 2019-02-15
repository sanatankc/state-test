import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Item from './TodoItem.style'

class TodoItem extends Component {
  state = {
    input: this.props.text,
  }

  onInputChange = e => {
    this.setState({ input: e.target.value })
  }

  closeEditInput = () => {
    // to close input it calles toggleEditing
    // which toggles editing property and which
    // in turn, closes input. Also on input close
    // it updates todo content, by calling editTodo
    const { toggleEditing, editTodo } = this.props
    toggleEditing()
    editTodo(this.state.input)
  }

  render() {
    const {
      completed,
      text,
      toggleTodo,
      deleteTodo,
      isEditing,
    } = this.props
    return (
      <Item>
        <input type='checkbox' checked={completed} onChange={toggleTodo} />
        {isEditing
          ? <Item.Input
            value={this.state.input}
            onChange={this.onInputChange}
            onBlur={this.closeEditInput}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  this.closeEditInput()
                }
              }}
          />
          : <Item.Label completed={completed} onClick={toggleTodo}>{text}</Item.Label>
        }
        <Item.Edit onClick={this.closeEditInput}>edit</Item.Edit>
        <Item.Delete onClick={deleteTodo}>delete</Item.Delete>
      </Item>
    )
  }
}

TodoItem.propTypes = {
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  toggleTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  toggleEditing: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  editTodo: PropTypes.func.isRequired,
}

export default TodoItem
