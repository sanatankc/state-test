import gql from 'graphql-tag'
import duck from '../../duck'

const updateChapter = (id, input) => duck.query({
  query: gql`
  mutation updateChapter(
    $id: ID!
    $input: ChapterUpdate!
  ) {
    updateChapter(
      id: $id
      input: $input
    ) {
      id
      order
      title
      description
      thumbnail {
        id
        name
        uri
      }
    }
  }`,
  type: duck.action.chapterUpdate,
  key: 'root',
  variables: {
    id,
    input
  }
})

export default updateChapter
