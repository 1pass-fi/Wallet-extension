import React, { createRef, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import SettingsIcon from 'img/settings-icon-new.svg'
import AddressBookIcon from 'img/v2/address-book-icon.svg'
import DefaultAvatar from 'img/v2/default-avatar.svg'
import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-white.svg'
import NotificationIcon from 'img/v2/notification-icon.svg'
import ArrowIcon from 'img/v2/settings/uparrow.svg'
import { showAddressBook } from 'options/actions/addressBook'
import { setNotifications } from 'options/actions/notifications'
import AccountSettings from 'options/components/AccountSettings'
import ActivityCenterDropdown from 'options/components/ActivityCenterDropdown'
import Balance from 'options/components/Balance'
import Loading from 'options/components/Loading'
import ToolTip from 'options/components/ToolTip'
import { DidContext } from 'options/context'
import { getDisplayingAccount } from 'options/selectors/displayingAccount'
import storage from 'services/storage'

const NavBar = () => {
  const dispatch = useDispatch()

  const displayingAccount = useSelector(getDisplayingAccount)

  const { profilePictureId } = useContext(DidContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotificationsCenter, setShowNotificationsCenter] = useState(false)

  const dropdownRef = createRef()
  const notificationRef = createRef()
  const notificationToggleRef = createRef()
  const dropdownToggleRef = createRef()

  const notificationsData = useSelector((state) => state.notificationsData)
  const isLoading = useSelector((state) => state.isLoading)

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
    <header style={{
      backgroundColor: '#373570',
      borderBottom: '1px solid rgba(137, 137, 199, 0.5)'
    }} className="sticky top-0 z-50 w-full h-16 3xl:h-20 4xl:h-24 flex items-center px-5.25 text-white text-sm 3xl:text-base 4xl:text-xl justify-between">
      <div className="flex items-center mr-1" role="navigation">
        <Link to="/settings/wallet" role="link">
          <KoiiLogo style={{width: '36px', height: '36px'}} />
        </Link>
        {/* <nav className="ml-6.25 3xl:ml-10 4xl:ml-20 tracking-finnieSpacing-wider" role="link">
          <NavLink to="/gallery">{chrome.i18n.getMessage('gallery')}</NavLink>
        </nav> */}
        {/* <nav className="ml-9 3xl:ml-12 4xl:ml-20 tracking-finnieSpacing-wider" role="link">
          <NavLink to="/create-nft">{chrome.i18n.getMessage('create')}</NavLink>
        </nav> */}
        {/* <nav className="ml-9 3xl:ml-12 4xl:ml-20 tracking-finnieSpacing-wider" role="link">
          <div
            className="cursor-not-allowed"
            data-tip={chrome.i18n.getMessage('featureUnderConstruction')}
            data-for="nav-collections"
          >
            {chrome.i18n.getMessage('create')}
          </div>
        </nav> */}
        {/* <nav className="ml-9 3xl:ml-12 4xl:ml-20 tracking-finnieSpacing-wider" role="link">
          <div
            className="cursor-not-allowed"
            data-tip={chrome.i18n.getMessage('comingSoon')}
            data-for="nav-collections"
          >
            {chrome.i18n.getMessage('collections')}
          </div>
        </nav> */}
        <ToolTip id="nav-collections" />
        {/* <nav className="ml-9 tracking-finnieSpacing-wider">
          <NavLink to="/friend-referral">Refer a friend</NavLink>
        </nav> */}
      </div>

      <div className="flex items-center justify-center">
        {isLoading !== 0 && <Loading />}
        <div
          className="relative ml-2"
          ref={notificationToggleRef}
          title="notification"
        >
          <NotificationIcon
            className="cursor-pointer"
            onClick={toggleNotificationsCenter}
            role="button"
            style={{width: '24px', height: '24px'}}
          />
          {notificationsData.new > 0 && (
            <div
              className="absolute top-2.25 left-1.75 bg-warning-200 rounded-full"
              style={{ width: '6px', height: '6px' }}
              title="new-notification-alert"
            ></div>
          )}
        </div>

        <nav className='ml-2'>
          <AddressBookIcon
            style={{ width: '24px', height: '24px'}}
            className="cursor-pointer"
            to="/#"
            onClick={() => dispatch(showAddressBook())}
          />
        </nav>
        {/* <Balance account={displayingAccount} /> */}
        <div className="relative ml-2">
          <div
            className="cursor-pointer"
            onClick={toggleDropdownMenu}
            data-testid="profile-picture-navbar"
          >
            <SettingsIcon />
          </div>
          {showDropdown && (
            <div className="absolute top-14 3xl:top-15 right-0 rounded shadow-2xl">
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
