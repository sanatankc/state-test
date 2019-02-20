import { cloneDeep, find, findIndex } from 'lodash'

const mergeCollectionsById = (prevData, nextData) => {
  const nextCollection = cloneDeep(prevData)
  for (const item of nextData) {
    const itemInPrevCollection = find(prevData, { id: item.id })
    const itemInPrevCollectionIndex = findIndex(prevData, { id: item.id })
    if (itemInPrevCollection) {
      nextCollection[itemInPrevCollectionIndex] = { ...itemInPrevCollection, ...item }
    } else {
      nextCollection.push(item)
    }
  }
  return nextCollection
}

export default mergeCollectionsById
