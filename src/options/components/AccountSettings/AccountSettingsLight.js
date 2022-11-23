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
  { text: 'Koii Identity (DID)', path: '/settings/kID', icon: DidIcon },
  { text: 'Gallery Settings', path: '/settings/gallery', icon: GalleryIcon },
  { text: 'Wallet Settings', path: '/settings/wallet', icon: WalletIcon },
  { text: 'Security', path: '/settings/security', icon: SecurityIcon },
  { text: 'About', path: '/settings/about', icon: AboutIcon },
  { text: 'Need Help?', path: '/settings/need-help', icon: NeedhelpIcon }
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
      {accountSettingItems.map(({ text, path, disabled, icon: Icon }, idx) =>
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
