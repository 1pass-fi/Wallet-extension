import React, { useState, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import HomeIcon from 'img/navbar/home.svg'
import CollectionIcon from 'img/navbar/collection.svg'
import CreateNFTIcon from 'img/navbar/create-nft.svg'
import SettingIcon from 'img/navbar/setting.svg'
import FriendIcon from 'img/navbar/friend.svg'
import AddressBookIcon from 'img/navbar/address-book-icon.svg'

import './index.css'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

import { GalleryContext } from 'options/galleryContext'
import { TYPE } from 'constants/accountConstants'

import { popupAccount } from 'services/account'

import AddressBook from 'options/components/AddressBook'
import SlideNavbar from './SlideNav'



export default () => {
  const { pathname } = useLocation()

  const [isExpandSubNavbar, setIsExpandSubNavbar] = useState(false)
  const [clickable, setClickable] = useState(true)
  const [hasArweave, setHasArweave] = useState(true)
  const [showAddressBook, setShowAddressBook] = useState(false)

  const defaultAccount = useSelector(state => state.defaultAccount)
  
  useEffect(() => {
    const showArweaveForm = async () => {
      const hasArweave = await popupAccount.hasArweave()
      const defaultAccountIsArweave = defaultAccount.type === TYPE.ARWEAVE
      setClickable(hasArweave && defaultAccountIsArweave)
      setHasArweave(hasArweave)
    }

    showArweaveForm()
  }, [defaultAccount])

  return (
    <div
      className="navbar-container"
      onMouseEnter={() => setIsExpandSubNavbar(true)}
      onMouseLeave={() => setIsExpandSubNavbar(false)}
    >
      <div className="navbar">
        <div className="top">
          <Link to="/">
            <div
              data-tip="Gallery"
              className={`nav-item ${pathname == '/' ? 'active' : ''}`}
            >
              <HomeIcon className="nav-item" />
            </div>
          </Link>

          <Link to={hasArweave ? '/create' : '#'}>
            <div
              data-tip={hasArweave ? 'Create NFT' : 'This feature only works with Koii NFTs. Transfer your NFT to Arweave to use it.'}
              className={`nav-item ${pathname == '/create' ? 'active' : ''}`}
            >
              <CreateNFTIcon className="nav-item" />
            </div>
          </Link>

          <Link to={hasArweave ? '/collections' : '#'}>
            <div
              data-tip={hasArweave ? 'Collections' : 'This feature is only compatible with Koii wallets. Create a Koii wallet to use it.'}
              className={`nav-item ${
                pathname == '/collections' ? 'active' : ''
              }`}
            >
              <CollectionIcon className="nav-item" />
            </div>
          </Link>

          <Link to="/settings">
            <div
              data-tip="Settings"
              className={`nav-item ${
                pathname.includes('/settings') ? 'active' : ''
              }`}
            >
              <SettingIcon className="nav-item" />
            </div>
          </Link>

          <div
            data-tip='Address Book'
            className={`nav-item addressBookIcon-wrapper ${
              showAddressBook ? 'active' : ''
            }`}
            onClick={() => setShowAddressBook(prev => !prev)}
          >
            <AddressBookIcon className="addressBookIcon" />
          </div>
        </div>

        <div className="bottom">
          <Link to={clickable ? '/friends' : '#'}>
            <div
              data-tip={clickable ? 'Refer a Friend' : 'This feature is only compatible with Koii wallets. Create a Koii wallet to use it.'}
              className={`nav-item friend ${
                pathname == '/friends' ? 'active' : ''
              }`}
            >
              <FriendIcon className="nav-item" />
            </div>
          </Link>
          <div className='address'>{defaultAccount.affiliateCode && `${defaultAccount.affiliateCode.slice(0, 5)}...`}</div>
        </div>
      </div>
      {pathname.includes('/settings') && !showAddressBook  && (
        <SlideNavbar isExpand={isExpandSubNavbar} />
      )}
      {showAddressBook && <AddressBook onClose={() => setShowAddressBook(false)}/>}
      <ReactTooltip place="top" type="dark" effect="float" />
    </div>
  )
}
