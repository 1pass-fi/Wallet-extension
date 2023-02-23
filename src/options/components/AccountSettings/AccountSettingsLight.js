import React from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import AboutIcon from 'img/v2/settings/about.svg'
import DidIcon from 'img/v2/settings/did.svg'
import GalleryIcon from 'img/v2/settings/gallery.svg'
import NeedhelpIcon from 'img/v2/settings/needhelp.svg'
// import NotificationIcon from 'img/v2/settings/notification.svg'
import SecurityIcon from 'img/v2/settings/security.svg'
import WalletIcon from 'img/v2/settings/wallet.svg'

const accountSettingItems = [
  {
    id: 'kid-dropdown-light',
    text: chrome.i18n.getMessage('koiiIdentity'),
    path: '/settings/kID',
    icon: DidIcon
  },
  {
    id: 'gallery-dropdown-light',
    text: chrome.i18n.getMessage('gallerySettings'),
    path: '/settings/gallery',
    icon: GalleryIcon
  },
  {
    id: 'wallet-dropdown-light',
    text: chrome.i18n.getMessage('walletSettings'),
    path: '/settings/wallet',
    icon: WalletIcon
  },
  {
    id: 'security-dropdown-light',
    text: chrome.i18n.getMessage('security'),
    path: '/settings/security',
    icon: SecurityIcon
  },
  {
    id: 'about-dropdown-light',
    text: chrome.i18n.getMessage('about'),
    path: '/settings/about',
    icon: AboutIcon
  },
  {
    id: 'need-help-dropdown-light',
    text: chrome.i18n.getMessage('needHelp'),
    path: '/settings/need-help',
    icon: NeedhelpIcon
  }
]

const AccountSettingsLight = React.forwardRef(({ className, toggleDropdownMenu }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'z-50 flex flex-col w-58.5 xl: 2xl: 3xl:w-68.5 bg-trueGray-200 text-blue-600 px-2 justify-evenly font-semibold text-sm xl: 2xl: 3xl:text-base rounded shadow-md',
        className
      )}
    >
      {accountSettingItems.map(({ id, text, path, disabled, icon: Icon }, idx) =>
        disabled ? (
          <div
            className={clsx(
              'h-12 xl: 2xl: 3xl:h-14 pl-2 text-trueGray-500 cursor-default flex items-center',
              idx !== 0 && 'border-t-2 border-trueGray-150 '
            )}
          >
            <Icon className="w-6 xl: 2xl: 3xl:w-7 mr-4 xl: 2xl: 3xl:mr-6" />
            {text}
          </div>
        ) : (
          <NavLink
            key={path}
            to={path}
            onClick={() => toggleDropdownMenu()}
            className={clsx(
              'h-12 xl: 2xl: 3xl:h-14 pl-2 flex items-center hover:underline underline-offset-1',
              idx !== 0 && 'border-t-2 border-trueGray-150'
            )}
            activeClassName="underline underline-offset-1"
            data-testid={id}
          >
            <Icon className="w-6 xl: 2xl: 3xl:w-7 mr-4 xl: 2xl: 3xl:mr-6" />
            {text}
          </NavLink>
        )
      )}
    </div>
  )
})

export default AccountSettingsLight
