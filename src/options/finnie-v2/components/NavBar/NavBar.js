import React, { createRef, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'

import Balance from 'finnie-v2/components/Balance'
import DefaultAvatar from 'img/v2/default-avatar.svg'
import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-white.svg'
import NotificationIcon from 'img/v2/bell-icon.svg'
import ArrowIcon from 'img/v2/settings/uparrow.svg'

import AccountSettings from 'finnie-v2/components/AccountSettings'
import ActivityCenterDropdown from 'finnie-v2/components/ActivityCenterDropdown'

import Loading from 'options/finnie-v1/components/loading'
import { GalleryContext } from 'options/galleryContext'
import { DidContext } from 'options/context'
import storage from 'services/storage'
import { setNotifications } from 'options/actions/notifications'
import { showAddressBook } from 'options/actions/addressBook'

const NavBar = () => {
  const { isLoading, displayingAccount } = useContext(GalleryContext)
  const { profilePictureId } = useContext(DidContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotificationsCenter, setShowNotificationsCenter] = useState(false)

  const dropdownRef = createRef()
  const notificationRef = createRef()
  const navbarRef = createRef()

  const dispatch = useDispatch()

  const defaultArweaveAccount = useSelector((state) => state.defaultAccount.AR)
  const defaultEthereumAccount = useSelector((state) => state.defaultAccount.ETH)
  const notificationsData = useSelector((state) => state.notificationsData)

  const toggleDropdownMenu = () => setShowDropdown((prev) => !prev)

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
    const handleClickOutside = async (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !navbarRef.current.contains(event.target)
      ) {
        // clear notifications
        let allNotifications = await storage.generic.get.pushNotification()
        allNotifications = allNotifications.map((n) => {
          n.new = false
          return n
        })
        dispatch(setNotifications(allNotifications))
        await storage.generic.set.pushNotification(allNotifications)

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
        <nav className="ml-9 tracking-finnieSpacing-wider">
          <NavLink to="/create-nft">Create</NavLink>
        </nav>
        <nav className="ml-9 cursor-pointer tracking-finnieSpacing-wider">
          <div to="/#" onClick={() => dispatch(showAddressBook())}>
            Address book
          </div>
        </nav>
        <nav className="ml-9 tracking-finnieSpacing-wider">
          <NavLink to="/friend-referral">Refer a friend</NavLink>
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
        <Balance account={displayingAccount} />
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
            <div className="absolute top-14 right-0 rounded shadow-2xl">
              <ArrowIcon className="absolute -top-2 right-2.5" />
              <AccountSettings
                ref={dropdownRef}
                toggleDropdownMenu={toggleDropdownMenu}
                type="light"
              />
            </div>
          )}
          {showNotificationsCenter && <ActivityCenterDropdown ref={notificationRef} />}
        </div>
      </div>
    </header>
  )
}

export default NavBar
