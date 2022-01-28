import clsx from 'clsx'
import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { name: 'Community', path: '/notifications/community', disabled: true },
  { name: 'Activity', path: '/notifications/activity' },
  { name: 'Assets', path: '/notifications/assets', disabled: true },
  { name: 'Notification Settings', path: '/notifications/notification-setting', disabled: true },
  { name: 'About', path: '/notifications/about', disabled: true }
]

const NotificationsCenterLinks = () => {
  return (
    <div className="flex flex-col w-58.5 bg-blue-700 text-white px-2 justify-evenly font-semibold text-sm rounded shadow-md">
      {navItems.map(({ name, path, disabled }, idx) =>
        disabled ? (
          <div
            className={clsx(
              'h-16 text-trueGray-500 cursor-default flex items-center',
              idx !== 0 && 'border-t-2 border-opacity-20 '
            )}
          >
            {name}
          </div>
        ) : (
          <NavLink
            className={clsx('h-16 flex items-center', idx !== 0 && 'border-t-2 border-opacity-20 ')}
            activeClassName="underline underline-offset-1"
            to={path}
            key={path}
          >
            {name}
          </NavLink>
        )
      )}
    </div>
  )
}

export default NotificationsCenterLinks
