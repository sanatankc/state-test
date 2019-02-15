import React from 'react'
import { mount } from 'enzyme'
import FilterButton from './FilterButton'

let component
describe('FilterButton', () => {
  afterEach(() => {
    component.unmount()
  })

  it('revokes callback when clicked button is not active', () => {
    /*
     * FilterButton is supposed to be called onClick, if button is not
     * already active, which is passed down as a prop. In this test
     * onClick should be called on button click simulation. We check
     * that by expecting isClicked to be true.
     */
    let isClicked = false
    const onClick = () => isClicked = true
    component = mount(<FilterButton isActive={false} label='text' onClick={onClick} />)
    component.find('button').simulate('click')
    expect(isClicked).toEqual(true)
  })

  it('does not revoke callback when clicked button is active', () => {
    /*
     * FilterButton is not supposed to be called onClick, if button is
     * already active, which is passed down as a prop. In this test
     * onClick should be called on button click simulation. We check
     * that by expecting isClicked to be still false after click.
     */
    let isClicked = false
    const onClick = () => isClicked = true
    component = mount(<FilterButton isActive label='text' onClick={onClick} />)
    component.find('button').simulate('click')
    expect(isClicked).toEqual(false)
  })
})
