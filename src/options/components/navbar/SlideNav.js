import React from 'react'
import './SlideNav.css'

import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

export default () => {
  const { pathname } = useLocation()
  return (
    <div className='slide-nav'>
      <div className='items'>
        <Link style={{ textDecoration: 'none' }} to='/settings/k-id'>
          <div className={pathname == '/settings/k-id' ? 'item active' : 'item'}>Koi Identity (kID)</div>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/settings/gallery'>
          <div className={pathname == '/settings/gallery' ? 'item active' : 'item'}>Gallery Settings</div>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/settings/wallet'>
          <div className={pathname == '/settings/wallet' ? 'item active' : 'item'}>Wallet Settings</div>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/settings/security'>
          <div className={pathname == '/settings/security' ? 'item active' : 'item'}>Security</div>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='#'>
          <div className={pathname == '/settings/customization' ? 'item active' : 'item'}>Customization</div>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/settings/about'>
          <div className={pathname == '/settings/about' ? 'item active' : 'item'}>About</div>
        </Link>
      </div>
    </div>
  )
}
