import React from 'react'
import { mount } from 'enzyme'
import TodoList from './TodoList'

const restProps = {
  toggleTodo: () => () => {},
  toggleEditing: () => () => {},
  deleteTodo: () => () => {},
  editTodo: () => () => {}
}

const todos = [
  {id: 1, text: 'First', isEditing: false, completed: false},
  {id: 2, text: 'Second', isEditing: false, completed: false},
  {id: 3, text: 'Third', isEditing: false, completed: true}
]

let component
describe('TodoList', () => {
  afterEach(() => {
    component.unmount()
  })
  it('renders list with only active items if the filter is active', () => {
    component = mount(
      <TodoList filter='ACTIVE' todos={todos} {...restProps} />
    )
    const items = component.find('TodoItem')
    expect(items.length).toBe(2)
    const activeTodos = todos.filter(todo => todo.completed === false)
    items.forEach((item, index) => {
      expect(item.text()).toEqual(activeTodos[index].text)
    })
  })

  it('renders list with only completed items if the filter is completed', () => {
    component = mount(
      <TodoList filter='COMPLETED' todos={todos} {...restProps} />
    )
    const items = component.find('TodoItem')
    expect(items.length).toBe(1)
    const activeTodos = todos.filter(todo => todo.completed === true)
    items.forEach((item, index) => {
      expect(item.text()).toEqual(activeTodos[index].text)
    })
  })

  it('renders list with all items if the filter is all', () => {
    component = mount(
      <TodoList filter='ALL' todos={todos} {...restProps} />
    )
    const items = component.find('TodoItem')
    expect(items.length).toBe(3)
    items.forEach((item, index) => {
      expect(item.text()).toEqual(todos[index].text)
    })
  })
})
