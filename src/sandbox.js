import { singular } from 'pluralize'
import deepdash from 'deepdash'

const _ = deepdash(lodash)
const data = {
  "chapters": [
    {
      "id":"cjs7qnzej00031hufiezr4bxv","title":"this is chpater kp","topics":[
        {"id":"cjs8118yc00031hw4vvsewkt","title":"topic 1 kp", "learningObjective": {
          image: {
            id: '123324',
            title: 'Image',
            uri: 'https://www.lo.'
          }
        }},
      ], messages: [{id: '32', title: '323' }]
    },
    {"id":"cjs810gcf00021hw4bpubnuwq","title":"chapter 2", "topics": [
      {"id":"cjs8118yc00031hw4vvsp6dkt","title":"topic 1 kp"},
      {"id":"cjs8118yc00031hw4vvsp6akt","title":"topic 1 kp", "learningObjective": {
        image: {
          id: '12344',
          title: 'Image',
          uri: 'https://www.lo.'
        }
      }},
    ],
    messages: [{id: '3432', title: '323' }]
  },
  ]
}
const schema = {
  chapter: {
    children: ['topic', 'message'],
  },
  topic: {
    children: ['learningObjective']
  },
  message: {},
  learningObjective: {}
}



const extractDataForDispatch = data => {

}

extractDataForDispatch(data)
