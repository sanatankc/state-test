import { List } from 'immutable'
import { isEmpty, omit, pick, get } from 'lodash'

export const getOrdersInUse = data => data.map(item => item.order)

export const getOrderAutoComplete = orders => {
  const defaultOrder = Math.max(...orders) + 1
  return Number.isFinite(defaultOrder) ? defaultOrder : 1
}

export const getItemByProp = (data, prop, value) => {
  const foundData = data.find(item => get(item, prop) === value) || {}
  return foundData
}

export const getDataByProp = (data, prop, value) => {
  if (!data) return []
  const foundData = data.filter(item => get(item, prop) === value) || []
  return foundData
}
export const getDataById = (data, id) => getItemByProp(data, 'id', id)

export const filterItems = (arr, itemsToRemove) => arr.filter(item => !itemsToRemove.includes(item))

/**
 * takes a children property and makes it parent
 * @example
 * ```js
 * const a = [
 *  { id: 0, parent: {id: 0} },
 *  { id: 1, parent: {id: 0} }
 *  { id: 2, parent: {id: 1} },
 *  { id: 3, parent: { id: 1 }}
 * ]
 * nestChildrenIntoParent(a, 'child', 'parent')
 * result -> [
 * { id: 0, child: [{ id: 0 }, {id: 1}] }
 * { id: 1, child: [{ id: 2 }, {id: 3}] }
 * ]
 * ```
 */
export const nestChildrenIntoParent = (children, childrenName, parentName, propertyToExtract) => {
  const data = []
  children.forEach(child => {
    const parent = pick(child, [parentName])[parentName]
    const rest = omit(child, [parentName, propertyToExtract])
    if (!parent || isEmpty(parent)) return
    const item = getDataById(data, parent.id)
    if (isEmpty(item)) {
      const dataToPush =
        propertyToExtract !== undefined
          ? {
            ...parent,
            [propertyToExtract]: child[propertyToExtract],
            [childrenName]: [rest]
          }
          : { ...parent, [childrenName]: [rest] }
      data.push(dataToPush)
    } else {
      const parentIndex = data.map(x => x.id).indexOf(parent.id)
      data[parentIndex][childrenName].push(rest)
    }
  })
  return data
}

export const nestTopicsInChapter = topics => nestChildrenIntoParent(topics, 'topics', 'chapter')

// ---- Immutable.js - part ---- //

/**
 * collectionA: List([ Map({ id:  0,  propA: 'a'})  ])
 * collectionB: List([ Map({ id: 0, propB: 'b'}), Map({ id: 1, propA: 'a' }) ])
 *
 * mergedList -->
 *  List([ Map({ id: 0, propA: 'a', propB: 'b' }), Map({ id: 1, propA: 'a' }) ])
 */
export const mergeListsOfMapsById = (collectionA, collectionB) => {
  let mergedList = collectionA
  // collectionB could be either List of Maps or Map
  // if Map --> convert into List of Map
  if (!List.isList(collectionB)) {
    collectionB = List([collectionB])
  }
  collectionB.forEach(itemB => {
    const indexOfItemBInCollectionA = collectionA.findIndex(
      itemA => itemA.get('id') === itemB.get('id')
    )
    if (indexOfItemBInCollectionA > -1) {
      mergedList = mergedList.update(indexOfItemBInCollectionA, item => item.merge(itemB))
    } else {
      mergedList = mergedList.push(itemB)
    }
  })
  return mergedList
}
