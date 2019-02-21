import { singular } from 'pluralize'

const schema = {
  chapter: {
    children: ['topic'],
  },
  topic: {
    children: ['learningObjective']
  },
  learningObjective: {}
}
const parser = (schema, field) => {
  const root = key => {
    return field === key
  }
  const plural = key => {
    return singular(field) === key
  }
  const parsers = [root, plural]
  for (const key of Object.keys(schema)) {
    for (const parser of parsers) {
      if (parser(key)) {
        return key
      }
    }
  }
  return false
}
const payload = {"chapter":[{"id":"cjs84jdtu00031hvw9c893qkv","title":"dsfasfasfasfs","topics":[{"id":"cjs8sgdte00001huzcg5ff9z4","title":"fdsfdsfdsafdsafs"}]},{"id":"cjs9d4pn900031h0jtdzc9rwx","title":"dsfsdfdsvb bgf bgfb","topics":[{"id":"cjsd2eu2600011hsa2rrtoile","title":"lkjdsakjfkdsjgkjsd flkdjf"}]}],"topic":[{"id":"cjs8sgdte00001huzcg5ff9z4","title":"fdsfdsfdsafdsafs"},{"id":"cjsd2eu2600011hsa2rrtoile","title":"lkjdsakjfkdsjgkjsd flkdjf"}]}

const res = Object.keys(payload).reduce((acc, key) => {
  return {
    ...acc,
    ...{[key]: payload[key].map(item => {
      return Object.keys(item).reduce((prev, next) => {
        if (parser(schema, next)) {
          return {
            ...prev,
            [next]: item[next].map(childItem => ({
              id: childItem.id
            }))
          }
        }
        return {...prev, [next]: item[next] }
      }, {})
    })}
  }
}, {})

res

// for (const rootKey in payload) {
//   for (const item of payload[rootKey]) {
//     for (const itemKey in item) {
//       itemKey
//     }
//   }
// }