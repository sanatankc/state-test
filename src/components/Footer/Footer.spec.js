import React from 'react'
import { mount } from 'enzyme'
import Footer from './Footer'

const fakeHistory = {
  state: [],
  push(item) {
    this.state.push(item)
  }
}
let component
describe('Footer', () => {
  afterEach(() => {
    component.unmount()
  })

  it('changes route to "/" when clicked on all button', () => {
    component = mount(<Footer activeButtonIndex={1} history={fakeHistory} />)
    const allButton = component.find('button').at(0)
    allButton.simulate('click')
    expect(fakeHistory.state).toContain('/')
  })

  it('changes route to "/active" when clicked on active button', () => {
    component = mount(<Footer activeButtonIndex={0} history={fakeHistory} />)
    const allButton = component.find('button').at(1)
    allButton.simulate('click')
    expect(fakeHistory.state).toContain('/active')
  })

  it('changes route to "/completed" when clicked on completed button', () => {
    component = mount(<Footer activeButtonIndex={1} history={fakeHistory} />)
    const allButton = component.find('button').at(2)
    allButton.simulate('click')
    expect(fakeHistory.state).toContain('/completed')
  })
})
