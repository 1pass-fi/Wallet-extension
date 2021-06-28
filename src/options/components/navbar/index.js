import React, { useState, useContext } from 'react'

import HomeIcon from 'img/navbar/home.svg'
import CollectionIcon from 'img/navbar/collection.svg'
import CreateNFTIcon from 'img/navbar/create-nft.svg'
import SettingIcon from 'img/navbar/setting.svg'
import FriendIcon from 'img/navbar/friend.svg'

import './index.css'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

import { GalleryContext } from 'options/galleryContext'

export default () => {
  const { affiliateCode } = useContext(GalleryContext)
  const { pathname } = useLocation()

  return (
    <div className='navbar'>
      <div className='top'>
        <Link to='/'>
          <HomeIcon className={`nav-item ${pathname == '/' ? 'active' : ''}`} />
        </Link>
        <Link to='/create'>
          <CreateNFTIcon
            className={`nav-item ${pathname == '/create' ? 'active' : ''}`}
          />
        </Link>
        <Link to='/collections'>
          <CollectionIcon
            className={`nav-item ${pathname == '/collections' ? 'active' : ''}`}
          />
        </Link>
        <Link to='/settings'>
          <SettingIcon
            className={`nav-item ${pathname == '/settings' ? 'active' : ''}`}
          />
        </Link>
      </div>
      <div className='bottom'>
        <Link to='/friends'>
          <FriendIcon
            className={`nav-item friend ${
              pathname == '/friends' ? 'active' : ''
            }`}
          />
        </Link>
        <div className='address'>{`${affiliateCode && affiliateCode.slice(0,5)}...`}</div>
      </div>
    </div>
  )
}
