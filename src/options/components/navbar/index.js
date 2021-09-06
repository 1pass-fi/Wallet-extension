import React, { useState, useContext, useRef, useEffect } from 'react'

import HomeIcon from 'img/navbar/home.svg'
import CollectionIcon from 'img/navbar/collection.svg'
import CreateNFTIcon from 'img/navbar/create-nft.svg'
import SettingIcon from 'img/navbar/setting.svg'
import FriendIcon from 'img/navbar/friend.svg'

import './index.css'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

import { GalleryContext } from 'options/galleryContext'

import SlideNavbar from './SlideNav'

import ReactTooltip from 'react-tooltip'

export default () => {
  const { affiliateCode } = useContext(GalleryContext)
  const { pathname } = useLocation()
  const [isExpandSubNavbar, setIsExpandSubNavbar] = useState(false)

  return (
    <div
      className='navbar-container'
      onMouseEnter={() => setIsExpandSubNavbar(true)}
      onMouseLeave={() => setIsExpandSubNavbar(false)}
    >
      <div className='navbar'>
        <div className='top'>
          <Link to='/'>
            <HomeIcon
              data-tip='Gallery'
              className={`nav-item ${pathname == '/' ? 'active' : ''}`}
            />
          </Link>
          <Link to='/create'>
            <CreateNFTIcon
              data-tip='Create NFT'
              className={`nav-item ${pathname == '/create' ? 'active' : ''}`}
            />
          </Link>
          <Link to='/collections'>
            <CollectionIcon
              data-tip='Collections'
              className={`nav-item ${
                pathname == '/collections' ? 'active' : ''
              }`}
            />
          </Link>
          <Link to='/settings'>
            <SettingIcon
              data-tip='Settings'
              className={`nav-item ${
                pathname.includes('/settings') ? 'active' : ''
              }`}
            />
          </Link>
        </div>
        <div className='bottom'>
          <Link to='/friends'>
            <FriendIcon
              data-tip='Refer a Friend'
              className={`nav-item friend ${
                pathname == '/friends' ? 'active' : ''
              }`}
            />
          </Link>
          <div className='address'>{`${
            affiliateCode && affiliateCode.slice(0, 5)
          }...`}</div>
        </div>
      </div>
      {pathname.includes('/settings') && (
        <SlideNavbar isExpand={isExpandSubNavbar} />
      )}
      <ReactTooltip place='top' type="dark" effect="float"/>
    </div>
  )
}
