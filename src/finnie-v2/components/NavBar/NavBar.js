import React, { createRef, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'

import Balance from 'finnie-v2/components/Balance'
import DefaultAvatar from 'img/v2/default-avatar.svg'
import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-white.svg'
import NotificationIcon from 'img/v2/bell-icon.svg'

import AccountSettings from 'finnie-v2/components/AccountSettings'
import ActivityCenterDropdown from 'finnie-v2/components/ActivityCenterDropdown'

import Loading from 'options/components/loading'
import { GalleryContext } from 'options/galleryContext'

const NavBar = () => {
  const { isLoading, profilePictureId } = useContext(GalleryContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotificationsCenter, setShowNotificationsCenter] = useState(false)

  const dropdownRef = createRef()
  const notificationRef = createRef()
  const navbarRef = createRef()

  const defaultAccount = useSelector((state) => state.defaultAccount)
  const notificationsData = useSelector((state) => state.notificationsData)

  const toggleDropdownMenu = () => setShowDropdown(!showDropdown)
  const closeDropdownMenu = () => setShowDropdown(false)

  const toggleNotificationsCenter = () => setShowNotificationsCenter(!showNotificationsCenter)
  const closeNotificationsCenter = () => setShowNotificationsCenter(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !navbarRef.current.contains(event.target)
      ) {
        closeDropdownMenu()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !navbarRef.current.contains(event.target)
      ) {
        closeNotificationsCenter()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationRef])

  return (
    <header className="sticky top-0 z-50 w-full h-16 flex items-center bg-indigo-900 px-5.25 text-white text-sm justify-between">
      <div className="flex items-center">
        <Link to="/">
          <KoiiLogo className="h-8 w-10.75" />
        </Link>
        <nav className="ml-6.25 tracking-finnieSpacing-wider">
          <NavLink to="/gallery">Gallery</NavLink>
        </nav>
      </div>

      <div className="flex items-center" ref={navbarRef}>
        {isLoading !== 0 && <Loading />}
        <div className="relative mx-6.5">
          <NotificationIcon
            className="h-6 w-4.5 cursor-pointer"
            onClick={toggleNotificationsCenter}
          />
          {notificationsData.new > 0 && (
            <span
              className={clsx(
                notificationsData.new > 99 ? 'text-3xs' : 'text-2xs',
                'flex items-center justify-center rounded-full w-4.25 h-4.25 bg-red-finnie absolute text-white font-semibold -top-1 -right-1.75'
              )}
            >
              {notificationsData.new > 99 ? `99+` : notificationsData.new}
            </span>
          )}
        </div>
        <Balance account={defaultAccount} />
        <div className="relative">
          <div
            className="w-10 h-10 cursor-pointer rounded-full ml-6.5"
            onClick={toggleDropdownMenu}
          >
            {profilePictureId ? (
              <img
                className="object-cover rounded-full w-full h-full"
                src={`https://arweave.net/${profilePictureId}`}
              />
            ) : (
              <DefaultAvatar className="object-cover rounded-full w-full h-full" />
            )}
          </div>
          {showDropdown && (
            <AccountSettings
              ref={dropdownRef}
              className="absolute top-14 right-0 rounded shadow-2xl"
            />
          )}
          {showNotificationsCenter && <ActivityCenterDropdown ref={notificationRef} />}
        </div>
      </div>
    </header>
  )
}

export default NavBar
