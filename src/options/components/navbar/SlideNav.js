import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import './SlideNav.css'

import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

export default ({ isExpand }) => {
  const { pathname } = useLocation()

  return (
    <div className={`slide-nav ${isExpand ? 'expand' : ''}`}>
      <div className='items'>
        <Link
          className={`item ${pathname == '/settings/k-id' ? 'active' : ''}`}
          to='/settings/k-id'
        >
          Koi Identity (kID)
        </Link>
        <Link
          className={`item ${pathname == '/settings/gallery' ? 'active' : ''}`}
          to='/settings/gallery'
        >
          Gallery Settings
        </Link>
        <Link
          className={`item ${pathname == '/settings/wallet' ? 'active' : ''}`}
          to='/settings/wallet'
        >
          Wallet Settings
        </Link>
        <Link
          className={`item ${pathname == '/settings/security' ? 'active' : ''}`}
          to='/settings/security'
        >
          Security
        </Link>
        <Link
          className={`item ${
            pathname == '/settings/customization' ? 'active' : ''
          }`}
          to='#'
        >
          <div>Customization</div>
          <div className='coming-soon'>coming soon!</div>
        </Link>
        <Link
          className={`item ${pathname == '/settings/about' ? 'active' : ''}`}
          to='/settings/about'
        >
          About
        </Link>
      </div>
    </div>
  )
}
