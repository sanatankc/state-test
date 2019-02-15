import GqlClient from './GqlClient'
import errors from './errors'

const token = 'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhjSEJKYm1adklqcDdJbTVoYldVaU9pSmpiM0psSWl3aWRIbHdaU0k2SW5OMFlYUnBZeUo5TENKcFlYUWlPakUxTkRVM05EUXdOVGdzSW1WNGNDSTZNVGcyTVRNeU1EQTFPSDAuWEFOT3RyR0RkS2hvWWVvNS1xZnM4SXRIcTh3MzZLbC1KX1VvS3NUSDJMbzo6ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5U1c1bWJ5STZleUpwWkNJNkltTnFhakI2Y0hsaWJ6QXdNREF4WmpCamEyczVlbkp3ZUhJaUxDSjFjMlZ5Ym1GdFpTSTZJbTVoYldGdWJYVnJkVzVrSW4wc0ltbGhkQ0k2TVRVME56QTJNekV3TUN3aVpYaHdJam94TlRjNE5qSXdOekF3ZlEuRVRqNlpYcUNaUmRsejkydTBvR24tZmd6Y1dBS3RuMFUzZ0FfMzNHcUk5Yw=='

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
