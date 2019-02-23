import gql from 'graphql-tag'
import duck from '../../duck'

const addChapter = input => duck.query({
  query: gql`
  mutation addChapter(
    $input: ChapterInput!
  ) {
    addChapter(input: $input) {
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
  type: duck.action.chapterAdd,
  key: 'root',
  variables: {
    input
  }
})

export default addChapter
