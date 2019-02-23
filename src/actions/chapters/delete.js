import gql from 'graphql-tag'
import duck from '../../duck'

const deleteChapter = id => duck.query({
  query: gql`
  mutation deleteChapter(
    $id: ID!
  ){
    deleteChapter(id: $id) {
      id
      title
    }
  }`,
  variables: {
    id
  },
  type: duck.action.chapterDelete,
  key: `root/${id}`,
})

export default deleteChapter
