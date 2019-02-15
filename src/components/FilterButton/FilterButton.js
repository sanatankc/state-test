import React from 'react'
import PropTypes from 'prop-types'
/*
 * isActive: decides if button should be active or not
 * onClick: function to be called on click event
 * label: label for the button
 */
const FilterButton = ({ isActive, onClick, label }) => (
  <button
    type={isActive ? 'primary' : 'default'}
    size='large'
    style={{ flex: '1' }}
    onClick={isActive ? null : onClick}
  > {label}
  </button>
)

FilterButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default FilterButton
