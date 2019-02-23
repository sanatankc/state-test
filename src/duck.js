import { singular, plural } from 'pluralize'
import mergeCollectionsById from './utils/mergeCollectionsById'
import State from './utils/State'

const fetchAddHandler = (state, action) => {
  const nextState = state
  for (const key of Object.keys(action.payload.extractedData)) {
    nextState[key][plural(key)] = mergeCollectionsById(
      nextState[key][plural(key)],
      action.payload.extractedData[key]
    )
  }
  return nextState
}

const deleteHandler = (state, action) => {
  const nextState = state
  for (const key of Object.keys(action.payload.extractedData)) {
    nextState[key][plural(key)] = nextState[key][plural(key)].filter(item =>
      item.id !== action.payload.extractedData[key].id
    )
  }
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
