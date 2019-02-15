import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Footer from './Footer'

const mapStateToProps = state => ({
  // state.filter is visibility filter for todos app
  // it has three states ['ALL', 'ACTIVE', 'COMPLETED']
  // activeButtonIndex is the index of currently activated filter
  // from the list.
  activeButtonIndex: ['ALL', 'ACTIVE', 'COMPLETED'].indexOf(state.filter)
})

export default connect(mapStateToProps)(withRouter(Footer))
