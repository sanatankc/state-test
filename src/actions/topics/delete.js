import gql from 'graphql-tag'
import duck from '../../duck'

const deleteTopic = id => duck.query({
  query: gql`
  mutation deleteTopic(
    $id: ID!
  ){
    deleteTopic(id: $id) {
      id
      title
    }
  }`,
  variables: {
    id
  },
  type: duck.action.topicDelete,
  key: `root/${id}`,
})

export default deleteTopic
