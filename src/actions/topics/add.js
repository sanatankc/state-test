import gql from 'graphql-tag'
import duck from '../../duck'

const addTopic = ({ chapterConnectId, ...input}) => duck.query({
  query: gql`
  mutation addTopic(
    $input: TopicInput!
    $chapterConnectId: ID!
  ) {
    addTopic(
      input: $input
      chapterConnectId: $chapterConnectId
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
  type: duck.action.topicAdd,
  key: 'root',
  variables: {
    input,
    chapterConnectId
  }
})

export default addTopic
