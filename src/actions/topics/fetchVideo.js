import duck from '../../duck'
import gql from 'graphql-tag'

const fetchVideo = id => duck.query({
  query: gql`{
    topic(id: "${id}") {
      id
      video {
        id
        name
        uri
      }
    }
  }`,
  type: duck.action.topicFetch,
  key: `video/${id}`
})

export default fetchVideo
