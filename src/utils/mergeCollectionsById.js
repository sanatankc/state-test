import { cloneDeep, find, findIndex } from 'lodash'

const mergeCollectionsById = (prevData, nextData) => {
  const nextCollection = cloneDeep(prevData)
  const mergeItemInCollection = item => {
    const itemInPrevCollection = find(prevData, { id: item.id })
    const itemInPrevCollectionIndex = findIndex(prevData, { id: item.id })
    if (itemInPrevCollection) {
      nextCollection[itemInPrevCollectionIndex] = { ...itemInPrevCollection, ...item }
    } else {
      nextCollection.push(item)
    }
  }
  if (Array.isArray(nextData)) {
    for (const item of nextData) {
      mergeItemInCollection(item)
    }
  } else {
    mergeItemInCollection(nextData)
  }
  return nextCollection
}

export default mergeCollectionsById
