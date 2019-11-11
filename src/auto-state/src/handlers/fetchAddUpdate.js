import { List, Map } from "immutable"

const mergeAndRemoveListOfMaps = (state, stateToBeMerged, key) => {
  let mergedListOfMaps = List([])
  let stateRelatedToKey = state.filter(item => item.get("__keys").includes(key))
  let stateNotRelatedToKey = state.filter(
    item => !item.get("__keys").includes(key)
  )

  const pushInMergedListOfMaps = (item, itemInMergedList) => {
    if (itemInMergedList !== -1) {
      mergedListOfMaps = mergedListOfMaps.set(
        itemInMergedList,
        mergedListOfMaps.get(itemInMergedList).merge(item)
      )
    } else {
      mergedListOfMaps = mergedListOfMaps.push(item)
    }
  }
  for (const item of stateToBeMerged) {
    let prevStateAtItemId = state.find(
      stateItem => stateItem.get("id") === item.get("id")
    )
    let itemInMergedList = mergedListOfMaps.findIndex(
      stateItem => stateItem.get("id") === item.get("id")
    )
    if (prevStateAtItemId) {
      if (!prevStateAtItemId.get("__keys").includes(key)) {
        prevStateAtItemId = prevStateAtItemId.set(
          "__keys",
          prevStateAtItemId.get("__keys").push(key)
        )
      }
      pushInMergedListOfMaps(prevStateAtItemId.merge(item), itemInMergedList)
      stateRelatedToKey = stateRelatedToKey.filter(
        stateItem => stateItem.get("id") !== item.get("id")
      )
      stateNotRelatedToKey = stateNotRelatedToKey.filter(
        stateItem => stateItem.get("id") !== item.get("id")
      )
    } else {
      pushInMergedListOfMaps(item.set("__keys", List([key])), itemInMergedList)
    }
  }
  mergedListOfMaps = mergedListOfMaps.merge(stateNotRelatedToKey)
  for (const item of stateRelatedToKey) {
    if (item.get("__keys").size > 1) {
      const keys = item.get("__keys")
      mergedListOfMaps = mergedListOfMaps.push(
        item.set("__keys", keys.delete(keys.findIndex(x => x === key)))
      )
    }
  }
  return mergedListOfMaps
}

const fetchAddUpdate = schema => (state, action) => {
  let nextState = state
  action.payload.getIn(["extractedData"]).map((val, key) => {
    const prevStateAtKey = nextState.getIn([key, "data"])
    let nextStateAtKey
    const keyType = schema[key].type
    if (keyType === "arrayOfObjects") {
      val = List.isList(val) ? val : List([val])
      nextStateAtKey = mergeAndRemoveListOfMaps(prevStateAtKey, val, action.key)
    } else if (keyType === "object") {
      nextStateAtKey = prevStateAtKey.merge(val)
    } else {
      nextStateAtKey = val
    }
    nextState = nextState.setIn([key, "data"], nextStateAtKey)
  })
  return nextState
}

export default fetchAddUpdate
