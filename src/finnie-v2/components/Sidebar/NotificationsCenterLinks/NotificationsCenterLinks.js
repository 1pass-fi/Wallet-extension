import clsx from 'clsx'
import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { name: 'Community', path: '/v2/notifications/community' },
  { name: 'Activity', path: '/v2/notifications/activity' },
  { name: 'Assets', path: '/v2/notifications/assets' },
  { name: 'Notification Settings', path: '/v2/notifications/notification-setting' },
  { name: 'About', path: '/v2/notifications/about' }
]

const NotificationsCenterLinks = () => {
  return (
    <div className="flex flex-col w-58.5 bg-blue-700 text-white px-2 justify-evenly font-semibold text-sm rounded shadow-md">
      {navItems.map(({ name, path }, idx) => (
        <NavLink
          className={clsx('h-16 flex items-center', idx !== 0 && 'border-t-2 border-opacity-20 ')}
          activeClassName="underline underline-offset-1"
          to={path}
          key={path}
        >
          {name}
        </NavLink>
      ))}
    </div>
  )
}

export default NotificationsCenterLinks
