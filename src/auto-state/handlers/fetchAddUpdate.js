import { List, Map } from 'immutable'
import { mergeListsOfMapsById } from '../data-utils'

const mergeAndRemoveListOfMaps = (state, stateToBeMerged, key) => {
  let mergedListOfMaps = List([])
  console.log(state)
  let stateRelatedToKey = state.filter(item => item.get('__keys').includes(key))
  let stateNotRelatedToKey = state.filter(item => !item.get('__keys').includes(key))

  for (const item of stateToBeMerged) {
    let prevStateAtItemId = state.find(stateItem => stateItem.get('id') === item.get('id'))
    if (prevStateAtItemId) {
      if (!prevStateAtItemId.get('__keys').includes(key)) {
        prevStateAtItemId = prevStateAtItemId.set(
          '__keys',
          prevStateAtItemId.get('__keys').push(key)
        )
      }
      mergedListOfMaps = mergedListOfMaps.push(prevStateAtItemId.merge(item))
      stateRelatedToKey = stateRelatedToKey.filter(
        stateItem => stateItem.get('id') !== item.get('id')
      )
      stateNotRelatedToKey = stateNotRelatedToKey.filter(
        stateItem => stateItem.get('id') !== item.get('id')
      )
    } else {
      mergedListOfMaps = mergedListOfMaps.push(item.set('__key', List([key])))
    }
  }
  mergedListOfMaps = mergedListOfMaps.merge(stateNotRelatedToKey)
  for (const item of stateRelatedToKey) {
    if (item.get('__keys').size > 1) {
      const keys = item.get('__keys')
      mergedListOfMaps = mergedListOfMaps.push(
        item.set('__keys', keys.delete(keys.findIndex(x => x === key)))
      )
    }
  }
  return mergedListOfMaps
}

const fetchAddUpdate = schema => (state, action) => {
  let nextState = state
  action.payload.getIn(['extractedData']).map((val, key) => {
    const prevStateAtKey = nextState.getIn([key, 'data'])
    let nextStateAtKey
    const keyType = schema[key].type
    if (keyType === 'arrayOfObjects') {
      if (List.isList(val)) {
        nextStateAtKey = mergeAndRemoveListOfMaps(prevStateAtKey, val, action.key)
      } else {
        nextStateAtKey = mergeListsOfMapsById(prevStateAtKey, val.set('__key', List([action.key])))
      }
    } else if (keyType === 'object') {
      nextStateAtKey = prevStateAtKey.merge(val)
    } else {
      nextStateAtKey = val
    }
    nextState = nextState.setIn([key, 'data'], nextStateAtKey)
  })
  return nextState
}

export default fetchAddUpdate
