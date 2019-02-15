import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setFilter } from '../../actions/index'
import TodoList from '../../components/TodoList'

class RootPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.dispatch(setFilter('ALL'))
  }

  render() {
    return (
      <TodoList />
    )
  }
}

export default connect()(RootPage)
