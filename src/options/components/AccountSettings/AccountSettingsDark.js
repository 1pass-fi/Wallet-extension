import React from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const accountSettingItems = [
  { text: 'Koii Identity (DID)', path: '/settings/kID' },
  { text: 'Gallery Settings', path: '/settings/gallery' },
  { text: 'Wallet Settings', path: '/settings/wallet' },
  { text: 'Security', path: '/settings/security' },
  { text: 'About', path: '/settings/about' },
  { text: 'Need Help?', path: '/settings/need-help' }
]

const AccountSettingsDark = React.forwardRef(({ className }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'z-50 flex flex-col w-58.5 xl: 2xl: 3xl:w-64 bg-blue-700 text-white px-2 justify-evenly',
        'font-semibold text-sm xl: 2xl: 3xl:text-base rounded shadow-md',
        className
      )}
    >
      {accountSettingItems.map(({ text, path, disabled }, idx) =>
        disabled ? (
          <div
            className={clsx(
              'h-9.75 xl: 2xl: 3xl:h-11 text-trueGray-500 cursor-default flex items-center',
              idx !== 0 && 'border-t-2 border-opacity-20 '
            )}
          >
            {text}
          </div>
        ) : (
          <NavLink
            key={path}
            to={path}
            className={clsx(
              'h-9.75 xl: 2xl: 3xl:h-11 flex items-center hover:underline underline-offset-1',
              idx !== 0 && 'border-t-2 border-opacity-20'
            )}
            activeClassName="underline underline-offset-1"
          >
            {text}
          </NavLink>
        )
      )}
    </div>
  )
})

export default AccountSettingsDark
