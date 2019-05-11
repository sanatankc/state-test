import GqlClient from './GqlClient'
import errors from './errors'

const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhjSEJKYm1adklqcDdJbTVoYldVaU9pSjBaV3RwWlV4bFlYSnVhVzVuUVhCd0lpd2lkSGx3WlNJNkluTjBZWFJwWXlKOUxDSnBZWFFpT2pFMU5UVTROekUyTWpBc0ltVjRjQ0k2TVRnM01UUTBOell5TUgwLlFuRmhwVGZBbHNJLVBYOHZiTTZWaEdvSUdwTmlsZ3hEUVFkaGdwb1dFQXc6OmV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeVNXNW1ieUk2ZXlKcFpDSTZJbU5xZFhGeWQzWXdjakF3TURBeGFIZGtkMjl0Tm1WMWJ6a2lMQ0oxYzJWeWJtRnRaU0k2SW1GaVl5SjlMQ0pwWVhRaU9qRTFOVFl4TVRBM01ETXNJbVY0Y0NJNk1UVTROelkyT0RNd00zMC5sSDZkZUNKZDdHcnhmbWNTaXdUb21SRlJYbi1vcWVTYXBCSWpVVTBRR0NV'

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
  url: 'https://tekie-backend.herokuapp.com/graphql/core',
  errorHandler: handleGraphqlResponseErrors
})

const requestToGraphql = async (query, variables) =>
  client.query(query, variables, {
    headers: {
      authorization: token
    }
  })

export default requestToGraphql
