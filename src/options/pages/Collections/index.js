import React from 'react'

import HeaderIcon from 'img/collections/header-icon.svg'
import OneIcon from 'img/collections/one-icon.svg'
import TwoIcon from 'img/collections/two-icon.svg'
import ThreeIcon from 'img/collections/three-icon.svg'

import './index.css'
import CollectionList from 'options/components/collectionList'

const Header = () => {
  return (
    <div className='collections-container__header'>
      <HeaderIcon />
      <div className='collections-container__header__title'>My Collections</div>
      <div className='collections-container__header__subtitle'>
        Coming soon!
      </div>
    </div>
  )
}

const OldContent = () => {
  return (
    <div className='collections-container__content'>
      <div className='collections-container__content__first'>
        Get your own custom website! With collections, you will be able to sort
        your assets however you like, and share them as groups with your friends
        and your followers.
        <br></br>
        Collections and the NFTs within them{' '}
        <span>
          will earn attention rewards, just like any other Atomic NFT.
        </span>
      </div>
      <div>
        <div className='collections-container__content__second__title'>
          Creating a new collection is as easy as...
        </div>
        <div className='collections-container__content__second__list'>
          <div className='collections-container__content__second__list__item'>
            <OneIcon />
            Coming up with a name and description
          </div>
          <div className='collections-container__content__second__list__item'>
            <TwoIcon />
            Adding a few tags
          </div>
          <div className='collections-container__content__second__list__item'>
            <ThreeIcon />
            Then selecting all the NFTs that you want to add from your gallery.
          </div>
        </div>
      </div>
      <div className='collections-container__content__third'>
        The Arweave storage fees will be incredibly low (as always) and you can
        add new works to a collection at any time.
      </div>
    </div>
  )
}

export default () => {
  return (
    <div className='collections-container'>
      <CollectionList />
    </div>
  )
}
