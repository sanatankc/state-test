import gql from 'graphql-tag'
import duck from '../../duck'

const uploadFile = (file, fileInput, connectInput) => duck.query({
  query: gql`
  mutation($fileInput: FileInput!, $connectInput: FileConnectInput!) {
    uploadFile(fileInput: $fileInput,
    connectInput: $connectInput
    ) {
      id,
      name,
      uri    }
  }`,
  type: duck.action[`${connectInput.type.toLowerCase()}Update`],
  key: `root/${connectInput.typeId}`,
  variables: {
    file,
    fileInput,
    connectInput
  },
  changeExtractedData: (extractedData, originalData, actionRoot) => ({
    [actionRoot]: {
      id: connectInput.typeId,
      [connectInput.typeField]: {
        ...originalData.uploadFile,
        uri: `${originalData.uploadFile.uri}?${Date.now()}`
      }
    }
  })
})

export default uploadFile
