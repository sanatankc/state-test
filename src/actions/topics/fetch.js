import duck from '../../duck'
import gql from 'graphql-tag'

const fetchTopics = input => duck.query({
  query: gql`{
    topics {
      id
      order
      title
      description
      chapter {
        id
        order
      }
    }
  }`,
  type: duck.action.topicFetch,
  key: `root`,
  variables: {
    input
  }
})

export default fetchTopics
