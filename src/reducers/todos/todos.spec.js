import reducer from './index'

describe('reducers : todos', () => {
  it('handles ADD_TODO', () => {
    const intialState = [
      { id: 1, text: 'TextA', completed: false, isEditing: false}
    ]
    const action = {
      type: 'ADD_TODO',
      text: 'TextB'
    }
    const nextState = reducer(intialState, action)
    expect(nextState).toEqual([
      { id: 1, text: 'TextA', completed: false, isEditing: false},
      { id: 2, text: 'TextB', completed: false, isEditing: false},
    ])
  })

  it('handles TOGGLE_TODO', () => {
    const intialState = [
      { id: 1, text: 'TextA', completed: false, isEditing: false}
    ]
    const action = {
      type: 'TOGGLE_TODO',
      id: 1,
    }
    const nextState = reducer(intialState, action)[0]
    expect(nextState.completed).toEqual(true)
  })

  it('handles DELETE_TODO', () => {
    const intialState = [
      { id: 1, text: 'TextA', completed: false, isEditing: false},
      { id: 2, text: 'TextB', completed: false, isEditing: false}
    ]
    const action = {
      type: 'DELETE_TODO',
      id: 1,
    }
    const nextState = reducer(intialState, action)
    expect(nextState).toEqual([
      { id: 2, text: 'TextB', completed: false, isEditing: false}
    ])
  })

  it('handles TOGGLE_EDITING', () => {
    const intialState = [
      { id: 1, text: 'TextA', completed: false, isEditing: false},
      { id: 2, text: 'TextB', completed: false, isEditing: false}
    ]
    const action = {
      type: 'TOGGLE_EDITING',
      id: 1,
    }
    const nextState = reducer(intialState, action)
    expect(nextState).toEqual([
      { id: 1, text: 'TextA', completed: false, isEditing: true},
      { id: 2, text: 'TextB', completed: false, isEditing: false}
    ])
  })

  it('handles EDIT_TODO', () => {
    const intialState = [
      { id: 1, text: 'TextA', completed: false, isEditing: false},
      { id: 2, text: 'TextB', completed: false, isEditing: false}
    ]
    const action = {
      type: 'EDIT_TODO',
      id: 1,
      text: 'TextC'
    }
    const nextState = reducer(intialState, action)
    expect(nextState).toEqual([
      { id: 1, text: 'TextC', completed: false, isEditing: false},
      { id: 2, text: 'TextB', completed: false, isEditing: false}
    ])
  })
})
