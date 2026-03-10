import React from 'react'
import './Navbar.css'
import assets from "../../assets/assets"

const Navbar = () => {
  return (
    <nav className='navbar'>
      <img 
        src={assets.logo} 
        alt="Company Logo" 
        className='logo' 
      />
      <img 
        src={assets.profile_icon} 
        alt="Profile Icon" 
        className='profile' 
      />
    </nav>
  )
}

export default Navbar