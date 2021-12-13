import React from 'react'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

const accountSettingItems = [
  { text: 'Koii Identity (kID)', path: '/v2/settings/kID' },
  { text: 'Gallery Settings', path: '/v2/settings/gallery' },
  { text: 'Wallet Settings', path: '/v2/settings/wallet' },
  { text: 'Security', path: '/v2/settings/security' },
  { text: 'Customization', path: '/v2/settings/#' },
  { text: 'About', path: '/v2/settings/about' }
]

const AccountSettings = ({ dropdown }) => {
  return (
    <div
      className={clsx(
        dropdown ? 'h-97.75' : 'h-68.5',
        'flex flex-col w-58.5 bg-blue-700 text-white px-2 justify-evenly gapy-3'
      )}
    >
      {accountSettingItems.map(({ text, path }) => (
        <NavLink key={path} to={path} activeClassName="underline-offset-1"> 
          {text}
          <hr className="rounded bg-white" />
        </NavLink>
      ))}
    </div>
  )
}

export default AccountSettings
