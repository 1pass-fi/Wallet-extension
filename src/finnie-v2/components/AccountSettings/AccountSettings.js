import React from 'react'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

const accountSettingItems = [
  { text: 'Koii Identity (kID)', path: '/settings/kID' },
  { text: 'Gallery Settings', path: '/settings/gallery' },
  { text: 'Wallet Settings', path: '/settings/wallet' },
  { text: 'Security', path: '/settings/security' },
  { text: 'Customization', path: '/settings/#', disabled: true },
  { text: 'About', path: '/settings/about' }
]

const AccountSettings = React.forwardRef(({ className }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'z-50 flex flex-col w-58.5 bg-blue-700 text-white px-2 justify-evenly font-semibold text-sm rounded shadow-md',
        className
      )}
    >
      {accountSettingItems.map(({ text, path, disabled }, idx) =>
        disabled ? (
          <div
            className={clsx(
              'h-16 text-trueGray-500 cursor-default flex items-center',
              idx !== 0 && 'border-t-2 border-opacity-20 '
            )}
          >
            {text}
          </div>
        ) : (
          <NavLink
            key={path}
            to={path}
            className={clsx('h-16 flex items-center', idx !== 0 && 'border-t-2 border-opacity-20 ')}
            activeClassName="underline underline-offset-1"
          >
            {text}
          </NavLink>
        )
      )}
    </div>
  )
})

export default AccountSettings
