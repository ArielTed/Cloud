import React from 'react'
import { Link } from "react-router-dom";

import './headerNav.css'

function HeaderNav() {
  return (
    <div className="HeaderNav">
      <div className="HeaderNav_itemsContainer">
        <Link to="/" className="HeaderNav_navItems">Home</Link>
        {/* <Link to="/user-queries" className="HeaderNav_navItems">User</Link>
        <Link to="/dev-queries" className="HeaderNav_navItems">Developper</Link> */}
        {/* <Link to="/admin-panel" className="HeaderNav_navItems">Admin</Link> */}
      </div>
      
    </div>
  )
}

export default HeaderNav
