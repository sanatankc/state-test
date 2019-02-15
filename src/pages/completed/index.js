import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setFilter } from '../../actions/index'
import TodoList from '../../components/TodoList'

class CompletedPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.dispatch(setFilter('COMPLETED'))
  }

  render() {
    return (
      <TodoList />
    )
  }
}

export default connect()(CompletedPage)
