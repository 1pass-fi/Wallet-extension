import React, { useState } from 'react'

import HomeIcon from 'img/navbar/home.svg'
import CollectionIcon from 'img/navbar/collection.svg'
import CreateNFTIcon from 'img/navbar/create-nft.svg'
import SettingIcon from 'img/navbar/setting.svg'
import FriendIcon from 'img/navbar/friend.svg'

import './index.css'

const routes = {
  HOME: 'home',
  CREATE_NFT: 'create_nft',
  COLLECTION: 'collection',
  SETTING: 'setting',
  FRIEND: 'friend',
}

export default () => {
  const [route, setRoute] = useState(routes.HOME)

  return (
    <div className='navbar'>
      <div className='top'>
        <HomeIcon
          className={`nav-item ${route == routes.HOME ? 'active' : ''}`}
          onClick={() => setRoute(routes.HOME)}
          fill='green'
        />
        <CreateNFTIcon
          className={`nav-item ${route == routes.CREATE_NFT ? 'active' : ''}`}
          onClick={() => setRoute(routes.CREATE_NFT)}
        />
        <CollectionIcon
          className={`nav-item ${route == routes.COLLECTION ? 'active' : ''}`}
          onClick={() => setRoute(routes.COLLECTION)}
        />
        <SettingIcon
          className={`nav-item ${route == routes.SETTING ? 'active' : ''}`}
          onClick={() => setRoute(routes.SETTING)}
        />
      </div>
      <div className='bottom'>
        <FriendIcon
          className={`nav-item friend ${route == routes.FRIEND ? 'active' : ''}`}
          onClick={() => setRoute(routes.FRIEND)}
        />
        <div className='address'>ABCD-123</div>
      </div>
    </div>
  )
}
