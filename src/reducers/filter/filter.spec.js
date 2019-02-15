import reducer from './index'

describe('reducers : filter', () => {
  it('handles SET_FILTER', () => {
    const intialState = 'ALL'
    const filter = 'COMPLETED'
    const action = {
      type: 'SET_FILTER',
      filter
    }
    const nextState = reducer(intialState, action)
    expect(nextState).toEqual(filter)
  })
})
