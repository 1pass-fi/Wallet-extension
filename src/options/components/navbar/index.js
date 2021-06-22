import React, { useState } from 'react'

import HomeIcon from 'img/navbar/home.svg'
import CollectionIcon from 'img/navbar/collection.svg'
import CreateNFTIcon from 'img/navbar/create-nft.svg'
import SettingIcon from 'img/navbar/setting.svg'
import FriendIcon from 'img/navbar/friend.svg'

import './index.css'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

const routes = {
  HOME: 'home',
  CREATE_NFT: 'create_nft',
  COLLECTION: 'collection',
  SETTING: 'setting',
  FRIEND: 'friend',
}

export default () => {
  const [route, setRoute] = useState('')
  const a = useLocation()
  console.log({ a: a.pathname })

  return (
    <div className='navbar'>
      <div className='top'>
        <Link to='/'>
          <HomeIcon
            className={`nav-item ${route == routes.HOME ? 'active' : ''}`}
          />
        </Link>
        <Link to='/create'>
          <CreateNFTIcon
            className={`nav-item ${route == routes.CREATE_NFT ? 'active' : ''}`}
          />
        </Link>
        <Link to='/collections'>
          <CollectionIcon
            className={`nav-item ${route == routes.COLLECTION ? 'active' : ''}`}
          />
        </Link>
        <Link to='/settings'>
          <SettingIcon
            className={`nav-item ${route == routes.SETTING ? 'active' : ''}`}
          />
        </Link>
      </div>
      <div className='bottom'>
        <FriendIcon
          className={`nav-item friend ${
            route == routes.FRIEND ? 'active' : ''
          }`}
          onClick={() => setRoute(routes.FRIEND)}
        />
        <div className='address'>ABCD-123</div>
      </div>
    </div>
  )
}
