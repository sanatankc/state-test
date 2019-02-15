import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import 'jest-styled-components'
import TodoItem from './TodoItem'
import Item from './TodoItem.style'

// default props to escape proptypes error
const defaultProps = {
  text: '',
  toggleTodo: () => { },
  completed: false,
  deleteTodo: () => {},
  isEditing: false,
  toggleEditing: () => {},
  editTodo: () => {}
}

let component
describe('TodoItem', () => {
  const text = 'Text'

  afterEach(() => {
    component.unmount()
  })

  it('renders an item', () => {
    component = mount(<TodoItem {...defaultProps} text={text} />)
    expect(component.text()).toEqual(text)
  })

  it('renders label, if not editing', () => {
    component = mount(<TodoItem {...defaultProps} text={text} />)
    // if editing is false, label should exist
    expect(component.find(Item.Label).length).toEqual(1)
    // but inputs should not.
    expect(component.find(Item.Input).length).toEqual(0)
  })

  it('renders Input, if editing', () => {
    component = mount(<TodoItem {...defaultProps} text={text} isEditing />)
    // if editing is true, label should not exist
    expect(component.find(Item.Label).length).toEqual(0)
    // but input should exists
    expect(component.find(Item.Input).length).toEqual(1)
  })

  it('should change input value if state.input is changed', () => {
    component = mount(<TodoItem {...defaultProps} text={text} isEditing />)
    const changedText = 'Changed Text'
    // sets state
    component.setState({ input: changedText }, () => {
      // after setting state
      const input = component.find(Item.Input)
      // checks if input value is also changed
      // as it is a controlled react component
      expect(input.props().value).toEqual(changedText)
    })
  })

  it('should revoke editTodo callback on enter on input', () => {
    // checks if it is calling ediTodo callback when enter is pressed
    // todoEdited is initially false
    let todoEdited = false
    // todoEdited will be true if fakeEditTodo is called
    const fakeEditTodo = () => todoEdited = true
    // we are passing fakeEditodo as editTodo props
    component = mount(
      <TodoItem
        {...defaultProps}
        text={text}
        isEditing
        editTodo={fakeEditTodo}
      />)
    // finds dom node for input
    const input = component.find(Item.Input).find('input')
    // focus on input
    input.simulate('focus')
    // and simulate Enter button on input
    // which in turns is expected call ediTodo callback
    // which is fakeEditTodo in our case
    input.simulate('keydown', { key: 'Enter' })
    // fakeEdittodo should be called which toggles
    // todoEdited to true
    expect(todoEdited).toEqual(true)
  })

  it('should revoke editTodo callback on blur on input', () => {
    // checks if it is calling ediTodo callback when input is blurred
    // i.e goes out of focus.
    // todoEdited is initially false
    let todoEdited = false
    // todoEdited will be true if fakeEditTodo is called
    const fakeEditTodo = () => todoEdited = true
    // we are passing fakeEditodo as editTodo props
    component = mount(
      <TodoItem
        {...defaultProps}
        text={text}
        isEditing
        editTodo={fakeEditTodo}
      />)
    // finds dom node for input
    const input = component.find(Item.Input).find('input')
    // focus on input
    input.simulate('focus')
    // and simulate blur on input
    // which in turns is expected call ediTodo callback
    // which is fakeEditTodo in our case
    input.simulate('blur')
    // fakeEdittodo should be called which toggles
    // todoEdited to true
    expect(todoEdited).toEqual(true)
  })

  it('should revoke editTodo callback on click on Edit Button', () => {
    // checks if it is calling ediTodo callback on Edit button click
    // i.e goes out of focus.
    // todoEdited is initially false
    let todoEdited = false
    // todoEdited will be true if fakeEditTodo is called
    const fakeEditTodo = () => todoEdited = true
    // we are passing fakeEditodo as editTodo props
    component = mount(
      <TodoItem
        {...defaultProps}
        text={text}
        isEditing
        editTodo={fakeEditTodo}
      />)
    // finds dom node edit button and simulate a click
    // which in turns is expected call ediTodo callback
    // which is fakeEditTodo in our case
    component.find(Item.Edit).simulate('click')
    // fakeEdittodo should be called which toggles
    // todoEdited to true
    expect(todoEdited).toEqual(true)
  })

  it('strikes through and opacity down label if item is completed', () => {
    // mounts TodoItem with completed prop
    component = mount(
      <TodoItem {...defaultProps} completed />
    )
    // gets label React Wrapper
    const label = component.find(Item.Label).get(0)
    // creates a json snapshot of label
    const labelTree = renderer.create(label).toJSON()
    // expects to have line-through in label
    expect(labelTree).toHaveStyleRule('text-decoration', 'line-through')
    // expects to have poacity down to 0.5
    expect(labelTree).toHaveStyleRule('opacity', '0.5')
  })

  it('should be checked if item is completed', () => {
    // mounts TodoItem with completed prop
    component = mount(<TodoItem {...defaultProps} completed />)
    // finds dom node of checkbox input
    const checkbox = component.find('input[type="checkbox"]')
    // expects checkbox to be checked
    expect(checkbox.props().checked).toEqual(true)
  })

  it('should revoke toggleTodo callback when checkbox is clicked/changed', () => {
    // isChecked is false initally
    let isChecked = false
    // but it will be true when faketoggleTodo is called
    const fakeToggleTodo = () => isChecked = true
    // mounts TodoItem with toggleodo prop passed as fakeToggletodo
    component = mount(
      <TodoItem {...defaultProps} toggleTodo={fakeToggleTodo} />
    )
    // finds dom node of checkbox input and simulates a change
    component.find('input[type="checkbox"]').simulate('change')
    // expects isChecked to be to be true
    // because fakeToggle should be called on
    // checkbox change
    expect(isChecked).toEqual(true)
  })

  it('should revoke toggleTodo callback when Label is clicked', () => {
    // isChecked is false initally
    let isChecked = false
    // but it will be true when faketoggleTodo is called
    const fakeToggleTodo = () => isChecked = true
    // mounts TodoItem with toggleodo prop passed as fakeToggletodo
    component = mount(
      <TodoItem {...defaultProps} toggleTodo={fakeToggleTodo} />
    )
    // finds Label and simulates a click
    component.find(Item.Label).simulate('click')
    // expects isChecked to be to be true
    // because fakeToggle should be called on
    // Label click
    expect(isChecked).toEqual(true)
  })

  it('should revoke callback for delete, when delete is clicked', () => {
    // isDeleted is false initially
    let isDeleted = false
    // it'll be true on fakeDeleteTodo function call
    const fakeDeleteTodo = () => isDeleted = true
    // mounts TodoItem with our fakeDeleteTodo as deleteTodo prop
    component = mount(
      <TodoItem {...defaultProps} deleteTodo={fakeDeleteTodo} />
    )
    // finds Delete Component and simulates click
    component.find(Item.Delete).simulate('click')
    // expects isDeleted to be to be true
    // because fakeDeleteTodo should be called on
    // delete button click
    expect(isDeleted).toEqual(true)
  })

  it('should revoke callback for editing, when edit is clicked', () => {
    // editing is initially false
    let editing = false
    // it'll be true on fakeToggleEditing function call
    const fakeToggleEditing = () => editing = true
    // mounts TodoItem with fakeToggleEditing as toggleEditing props
    component = mount(
      <TodoItem {...defaultProps} toggleEditing={fakeToggleEditing} />
    )
    // finds edit button component and simulates a click
    component.find(Item.Edit).simulate('click')
    // expects editing to be to be true
    // because fakeToggleEditing should be called on
    // edit button click
    expect(editing).toEqual(true)
  })

  it('should revoke callback for editing, when edit is clicked in edit mode', () => {
    // editing is initially false
    let editing = false
    // it'll be true on fakeToggleEditing function call
    const fakeToggleEditing = () => editing = true
    // mounts TodoItem with fakeToggleEditing as toggleEditing props
    // and isEditing with true
    component = mount(
      <TodoItem {...defaultProps} isEditing toggleEditing={fakeToggleEditing} />
    )
    // finds edit button component and simulates a click
    component.find(Item.Edit).simulate('click')
    // expects editing to be to be true
    // because fakeToggleEditing should be called on
    // edit button click
    expect(editing).toEqual(true)
  })
})
