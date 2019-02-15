import React from 'react'
import PropTypes from 'prop-types'
import FilterButton from '../FilterButton'

const Footer = ({ activeButtonIndex, history }) => (
  <div style={{ display: 'flex' }}>
    <FilterButton
      onClick={() => history.push('/')}
      isActive={activeButtonIndex === 0}
      label='All'
    />
    <FilterButton
      onClick={() => history.push('/active')}
      isActive={activeButtonIndex === 1}
      label='Active'
    />
    <FilterButton
      onClick={() => history.push('/completed')}
      isActive={activeButtonIndex === 2}
      label='Completed'
    />
  </div>
)

Footer.propTypes = {
  activeButtonIndex: PropTypes.oneOf([0, 1, 2]).isRequired,
  history: PropTypes.shape({}).isRequired
}

export default Footer
