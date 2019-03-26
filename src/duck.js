import { singular, plural } from 'pluralize'
import mergeListsOfMapsById from './utils/mergeListsOfMapsById'
import State from './utils/State'

const fetchAddHandler = (state, action) => {
  let nextState = state
  action.payload.getIn(['extractedData']).map((val, key) => {
    nextState = nextState.setIn([key, plural(key)], mergeListsOfMapsById(
      nextState.getIn([key, plural(key)]),
      val
    ))
  })
  return nextState
}

const deleteHandler = (state, action) => {
  let nextState = state
  action.payload.getIn(['extractedData']).map((val, key) => {
    const filteredData = nextState.getIn([key, plural(key)])
      .filter(item => {
        console.log(item.get('id'), val.get('id'))
        return item.get('id') !== val.get('id')
      })
    nextState = nextState.setIn([key, plural(key)], filteredData)
  })
  return nextState
}
const parser = (schema, field) => {
  const root = key => field === key
  const plural = key => singular(field) === key
  const add = key => field.replace('add', '').toLowerCase() === key
  const deleteItem = key => field.replace('delete', '').toLowerCase() === key
  const update = key => field.replace('update', '').toLowerCase() === key

  const parsers = [root, plural, add, deleteItem, update]
  for (const key of Object.keys(schema)) {
    for (const parser of parsers) {
      if (parser(key)) {
        return key
      }
    }
  }
  return false
}


const duck = new State({
  schema: {
    chapter: {
      children: ['topic'],
    },
    topic: {
      children: ['learningObjective']
    },
    learningObjective: {}
  },
  parser,
  presets: {
    fetch: (state, action) => {
      let nextState = state
      if (action.type.split('/')[2] === 'success') {
        nextState = fetchAddHandler(state, action)
      }
      return nextState
    },
    add: (state, action) => {
      let nextState = state
      if (action.type.split('/')[2] === 'success') {
        nextState = fetchAddHandler(state, action)
      }
      return nextState
    },
    delete: (state, action) => {
      let nextState = state
      if (action.type.split('/')[2] === 'success') {
        nextState = deleteHandler(state, action)
      }
      return nextState
    },
    update: (state, action) => {
      let nextState = state
      if (action.type.split('/')[2] === 'success') {
        nextState = fetchAddHandler(state, action)
      }
      return nextState
    }
  },
})

export default duck
