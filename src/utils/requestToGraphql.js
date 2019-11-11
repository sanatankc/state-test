import GqlClient from './GqlClient'
import errors from './errors'

const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhjSEJKYm1adklqcDdJbTVoYldVaU9pSjBaV3RwWlV4bFlYSnVhVzVuUVhCd0lpd2lkSGx3WlNJNkluTjBZWFJwWXlKOUxDSnBZWFFpT2pFMU5UVTROekUyTWpBc0ltVjRjQ0k2TVRnM01UUTBOell5TUgwLlFuRmhwVGZBbHNJLVBYOHZiTTZWaEdvSUdwTmlsZ3hEUVFkaGdwb1dFQXc6OmV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeVNXNW1ieUk2ZXlKcFpDSTZJbU5xZVd4dWEyeDVNVEF3TURReGFEQTBOMnhxWVdwNGEzWWlmU3dpYVdGMElqb3hOVGN3TlRNMk9UWTBMQ0psZUhBaU9qRTJNREl3T1RRMU5qUjkuWjIyYzlENk9oaVl1U0FISVZYNlZ3bXdTNWpEM0tlYnhsMk9HbWNWTzVyRQ=='

const handleGraphqlResponseErrors = errordata => {
  let errorMessage
  if (errordata.errors && errordata.errors.length && errordata.errors[0].name) {
    errorMessage = errordata.errors[0].name
  }
  if (errordata.message) {
    errorMessage = errordata.message
  }
  if (errorMessage === errors.UnauthenticatedUserError) {
    console.error('Not auth!!!!')
  }
  return errorMessage || errors.UnexpectedError
}

const client = new GqlClient({
  url: 'https://tekie-backend-dev.herokuapp.com/graphql/core',
  errorHandler: handleGraphqlResponseErrors
})

const requestToGraphql = async (query, variables) =>
  client.query(query, variables, {
    headers: {
      authorization: token
    }
  })

export default requestToGraphql
