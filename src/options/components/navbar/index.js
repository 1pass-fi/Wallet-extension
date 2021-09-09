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
            <div data-tip='Gallery'>
              <HomeIcon
                className={`nav-item ${pathname == '/' ? 'active' : ''}`}
              />
            </div>
          </Link>
          <Link to='/create'>
            <div data-tip='Create NFT'>
              <CreateNFTIcon
                className={`nav-item ${pathname == '/create' ? 'active' : ''}`}
              />
            </div>
          </Link>
          <Link to='/collections'>
            <div data-tip='Collections'>
              <CollectionIcon
                
                className={`nav-item ${
                  pathname == '/collections' ? 'active' : ''
                }`}
              />
            </div>
          </Link>
          <Link to='/settings'>
            <div data-tip='Settings'>
              <SettingIcon
                className={`nav-item ${
                  pathname.includes('/settings') ? 'active' : ''
                }`}
              />
            </div>
          </Link>
        </div>
        <div className='bottom'>
          <Link to='/friends'>
            <div data-tip='Refer a Friend'>
              <FriendIcon
                className={`nav-item friend ${
                  pathname == '/friends' ? 'active' : ''
                }`}
              />
            </div>
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
