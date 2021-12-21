import React, { createRef, useEffect, useState, useContext } from 'react'
import { useSelector } from 'react-redux'

import { NavLink } from 'react-router-dom'

import Balance from 'finnie-v2/components/Balance'
import DefaultAvatar from 'img/v2/default-avatar.svg'
import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-white.svg'
import NotificationIcon from 'img/v2/bell-icon.svg'
import AccountSettings from 'finnie-v2/components/AccountSettings'
import { GalleryContext } from 'options/galleryContext'

const NavBar = () => {
  const { profilePictureId } = useContext(GalleryContext)

  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = createRef()

  const defaultAccount = useSelector((state) => state.defaultAccount)

  const toggleDropdownMenu = () => setShowDropdown(!showDropdown)
  const closeDropdownMenu = () => setShowDropdown(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdownMenu()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  return (
    <header className="sticky top-0 z-50 w-full h-16 flex items-center bg-indigo-900 px-5.25 text-white text-sm justify-between">
      <div className="flex items-center">
        <div className="h-8 w-10.75">
          <KoiiLogo className="h-8 w-10.75" />
        </div>
        <nav className="ml-6.25 tracking-finnieSpacing-wider">
          <NavLink to="/v2/gallery">Gallery</NavLink>
        </nav>
      </div>

      <div className="flex items-center">
        <NotificationIcon className="h-5 w-3.75 mr-6.5" />
        <Balance koiiBalance={defaultAccount.koiBalance} arBalance={defaultAccount.balance} />
        <div className="cursor-pointer relative">
          <div className="w-10 h-10 ml-6.5" onClick={toggleDropdownMenu}>
            {profilePictureId ? 
              <div style={{borderRadius:'50%', display:'flex', justifyContent: 'center', alignItems:'center',
                overflow:'hidden', width:'40px', height:'40px', 
              }} >
                <img 
                  style={{minHeight:'100%', minWidth:'100%', width:'auto', height:'auto', objectFit:'cover'}} 
                  src={`https://arweave.net/${profilePictureId}`}
                />
              </div> :
              <DefaultAvatar />
            }
          </div>
          {showDropdown && (
            <AccountSettings
              ref={dropdownRef}
              className="absolute top-14 right-0 rounded shadow-2xl"
            />
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar
