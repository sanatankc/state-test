import duck from '../../duck'
import gql from 'graphql-tag'

const fetchChapters = input => duck.query({
  query: gql`{
    chapters {
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
  type: duck.action.chapterFetch,
  key: 'root',
  variables: {
    input
  }
})

export default fetchChapters
