import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from './AddTodoInput.style'
import { addTodo } from '../../actions'

class AddTodoInput extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    input: '',
  }

  onSubmit = e => {
    e.preventDefault()
    if (this.state.input !== '') {
      this.props.dispatch(addTodo(this.state.input))
      this.setState({ input: '' })
    }
  }

  onChange = e => {
    this.setState({ input: e.target.value })
  }


  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Input
          placeholder='Add todo'
          size='large'
          value={this.state.input}
          onChange={this.onChange}
        />
        <Form.Button size='large' type='primary' htmlType='submit'>Add todo</Form.Button>
      </Form>
    )
  }
}

export default AddTodoInput
