import gql from 'graphql-tag'
import duck from '../../duck'

const updateTopic = (id, input) => duck.query({
  query: gql`
  mutation updateTopic(
    $id: ID!
    $input: TopicUpdate!
  ) {
    updateTopic(
      id: $id
      input: $input
    ) {
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
  type: duck.action.topicUpdate,
  key: 'root',
  variables: {
    id,
    input
  }
})

export default updateTopic
