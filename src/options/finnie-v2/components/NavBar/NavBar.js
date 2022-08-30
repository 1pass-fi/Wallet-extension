import React, { createRef, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import AccountSettings from 'finnie-v2/components/AccountSettings'
import ActivityCenterDropdown from 'finnie-v2/components/ActivityCenterDropdown'
import Balance from 'finnie-v2/components/Balance'
import AddressBookIcon from 'img/v2/address-book-icon.svg'
import DefaultAvatar from 'img/v2/default-avatar.svg'
import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-white.svg'
import NotificationIcon from 'img/v2/notification-icon.svg'
import ArrowIcon from 'img/v2/settings/uparrow.svg'
import isEmpty from 'lodash/isEmpty'
import { showAddressBook } from 'options/actions/addressBook'
import { setNotifications } from 'options/actions/notifications'
import { DidContext } from 'options/context'
import Loading from 'options/finnie-v1/components/loading'
import { GalleryContext } from 'options/galleryContext'
import storage from 'services/storage'

const NavBar = () => {
  const { isLoading, displayingAccount } = useContext(GalleryContext)
  const { profilePictureId } = useContext(DidContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotificationsCenter, setShowNotificationsCenter] = useState(false)

  const dropdownRef = createRef()
  const notificationRef = createRef()
  const notificationToggleRef = createRef()
  const dropdownToggleRef = createRef()

  const dispatch = useDispatch()
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
        !dropdownToggleRef.current.contains(event.target)
      ) {
        closeDropdownMenu()
      }
    }

    const handlePressingEsc = (event) => {
      if (event.defaultPrevented) {
        return // Should do nothing if the default action has been cancelled
      }

      if (event.key === 'Escape') {
        closeDropdownMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handlePressingEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handlePressingEsc)
    }
  }, [dropdownRef])

  useEffect(() => {
    const handleClickOutside = async (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !notificationToggleRef.current.contains(event.target)
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

    const handlePressingEsc = async (event) => {
      if (event.defaultPrevented) {
        return // Should do nothing if the default action has been cancelled
      }

      if (event.key === 'Escape') {
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
    document.addEventListener('keydown', handlePressingEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handlePressingEsc)
    }
  }, [notificationRef])

  return (
    <header className="sticky top-0 z-50 w-full h-16 flex items-center bg-indigo-900 px-5.25 text-white text-sm justify-between">
      <div className="flex items-center mr-1">
        <Link to="/">
          <KoiiLogo className="h-8 w-10.75" />
        </Link>
        <nav className="ml-6.25 tracking-finnieSpacing-wider">
          <NavLink to="/gallery">Gallery</NavLink>
        </nav>
        <nav className="ml-9 tracking-finnieSpacing-wider">
          <NavLink to="/create-nft">Create</NavLink>
        </nav>
        <nav className="ml-9 tracking-finnieSpacing-wider">
          <NavLink to="/collections">Collections</NavLink>
        </nav>
        {/* <nav className="ml-9 tracking-finnieSpacing-wider">
          <NavLink to="/friend-referral">Refer a friend</NavLink>
        </nav> */}
      </div>

      <div className="flex items-center">
        {isLoading !== 0 && <Loading />}
        <div
          className="relative ml-6.5"
          style={{ width: '48px', height: '48px' }}
          ref={notificationToggleRef}
        >
          <NotificationIcon className="cursor-pointer" onClick={toggleNotificationsCenter} />
          {notificationsData.new > 0 && (
            <div
              className="absolute top-2.25 left-1.75 bg-warning-200 rounded-full"
              style={{ width: '6px', height: '6px' }}
            ></div>
          )}
        </div>

        <nav className="ml-2 mr-4.5">
          <AddressBookIcon
            className="cursor-pointer"
            to="/#"
            onClick={() => dispatch(showAddressBook())}
            style={{ width: '48px', height: '48px' }}
          />
        </nav>
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
              <div
                style={{ width: '38px', height: '38px' }}
                className="flex items-center justify-center object-cover rounded-full w-full h-full bg-white"
                ref={dropdownToggleRef}
              >
                <DefaultAvatar style={{ width: '36px', height: '36px' }} />
              </div>
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
