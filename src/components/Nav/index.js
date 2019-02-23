import React from 'react'
import { Link } from 'react-router-dom'

const linkPadding = {
  padding: '20px',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center'
}
const Nav = () => (
  <div>
    <Link to='/chapters' style={linkPadding}>Chapters</Link>
    <Link to='/topics' style={linkPadding}>Topics</Link>
  </div>
)

export default Nav
