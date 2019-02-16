import lodash, { get } from 'lodash'
import { singular } from 'pluralize'
import deepdash from 'deepdash'

const _ = deepdash(lodash)
const data ={"chapters":[{"id":"cjs7qnzej00031hufiezr4bxv","title":"this is chpater kp","topics":[]},{"id":"cjs810gcf00021hw4bpubnuwq","title":"chapter 2","topics":[{"id":"cjs8118yc00031hw4vvsp6akt","title":"topic 1 kp"}]}]}
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
  const forAllSchema = () => {}
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

const extractDataForDispatch = data => {
  let dataForSchema = data[Object.keys(data)[0]]
  dataForSchema = Array.isArray(dataForSchema) ? dataForSchema[0] : dataForSchema
  _.eachDeep(dataForSchema, (value, key, path, depth, parent, parentKey, parentPath) => {
    const parsedRoot = parser(schema, key)
    if (parsedRoot) {
      parsedRoot //?
    }
  })
  console.log(data)
}

extractDataForDispatch(data)
