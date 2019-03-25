import { List } from 'immutable'

const mergeListsOfMapsById = (collectionA, collectionB) => {
  let mergedList = collectionA
  if (!List.isList(collectionB)) {
    collectionB = List([ collectionB ])
  }
  collectionB.forEach(itemB => {
    console.log(itemB)
    const indexOfItemBInCollectionA =
      collectionA.findIndex(itemA => itemA.get('id') === itemB.get('id'))
    if (indexOfItemBInCollectionA > -1) {
      mergedList = mergedList.update(indexOfItemBInCollectionA, item => item.merge(itemB))
    } else {
      mergedList = mergedList.push(itemB)
    }
  })
  return mergedList
}

export default mergeListsOfMapsById
