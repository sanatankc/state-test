import gql from 'graphql-tag'
import duck from '../../duck'

const addTopic = input => duck.query({
  query: gql`
  mutation addTopic(
    $input: TopicInput!
  ) {
    addTopic(input: $input) {
      id
      order
      title
      description
    }
  }`,
  type: duck.action.topicAdd,
  key: 'root',
  variables: {
    input
  }
})

export default addTopic
