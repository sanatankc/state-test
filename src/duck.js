import State from './auto-state'
import requestToGraphql from './utils/requestToGraphql'
import schema from './schema'

const duck = new State({
  schema,
  graphqlLib: requestToGraphql
})

export default duck
