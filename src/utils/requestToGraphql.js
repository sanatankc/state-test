import GqlClient from './GqlClient'
import errors from './errors'

const token = 'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhjSEJKYm1adklqcDdJbTVoYldVaU9pSjBaV3RwWlZSdGN5SXNJblI1Y0dVaU9pSnpkR0YwYVdNaWZTd2lhV0YwSWpveE5UVXdNREF5TkRReExDSmxlSEFpT2pFNE5qVTFOemcwTkRGOS4yWFpmcU1FdEphUGFWakdMcjZ2M3VrLWQzMGlqLUNKMjduQTEtd0NvOU9FOjpleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlTVzVtYnlJNmV5SnBaQ0k2SW1OcWFqQjZjSGxpYnpBd01EQXhaakJqYTJzNWVuSndlSElpTENKMWMyVnlibUZ0WlNJNkltNWhiV0Z1YlhWcmRXNWtJbjBzSW1saGRDSTZNVFUxTURJNE1USXhNaXdpWlhod0lqb3hOVGd4T0RNNE9ERXlmUS43QThjQUlFaFB2SXhBenQtS3laSUxTOHVVd1hOdEJtOGx6cUxXQTItVEx3'

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
