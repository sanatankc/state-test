import React from 'react'
import { mount } from 'enzyme'
import AddTodoInput from './AddTodoInput'

let component
// mount: A method that re-mounts the component. This can be
// used to simulate a component going through an unmount/mount lifecycle.
// simulate: simulate events on a component or dom nodes
describe('AddTodoInput', () => {
  afterEach(() => {
    component.unmount()
  })

  it('should change input value on state.input change', () => {
    // fakes dispatch function from redux to avoid protoTypes error
    const fakeDispatch = () => { }
    component = mount(<AddTodoInput dispatch={fakeDispatch} />)
    const text = 'Random Text'
    component.setState({ input: text })
    expect(component.find('input.ant-input').props().value).toEqual(text)
  })

  it('should call dispatch on submit', () => {
    /*
     * add todo function is supposed to call dispatch function
     * on search form submit. We fake a dispatch function from
     * redux and expects it to be called on search form submit.
     * which check that by toggling isDispatched from false to
     * true on fakeDispatch call.
     */
    let isDispatched = false
    const fakeDispatch = () => isDispatched = true
    component = mount(<AddTodoInput dispatch={fakeDispatch} />)
    const text = 'Random Text'
    component.setState({ input: text })
    component.find('form').simulate('submit')
    expect(isDispatched).toEqual(true)
  })

  it('should not call dispatch on submit when input is blank', () => {
    /*
     * add todo function is not supposed to call dispatch function
     * on search form submit, if input is empty. After simulating
     * submit on form, isDispatched still is expected to be false.
     */
    let isDispatched = false
    const fakeDispatch = () => isDispatched = true
    component = mount(<AddTodoInput dispatch={fakeDispatch} />)
    component.find('form').simulate('submit')
    expect(isDispatched).toEqual(false)
  })
})
