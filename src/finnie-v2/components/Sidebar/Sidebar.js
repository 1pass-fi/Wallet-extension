import React from 'react'
import { NavLink } from 'react-router-dom'

import CreateIcon from 'img/v2/create-icon.svg'
import GalleryIcon from 'img/v2/gallery-icon.svg'
import CollectionIcon from 'img/v2/collection-icon.svg'
import SettingIcon from 'img/v2/setting-icon.svg'

const navItems = [
  { icon: CreateIcon, path: '/v2/create' },
  { icon: GalleryIcon, path: '/v2/gallery' },
  { icon: CollectionIcon, path: '/v2/collection' },
  { icon: SettingIcon, path: '/v2/settings' }
]

const Sidebar = () => {
  return (
    <nav className="flex items-center justify-between gapx-3">
      {navItems.map(({ icon: Icon, path }) => (
        <NavLink
          key={path}
          to={path}
          className="flex items-center justify-center w-13.75 h-11.25"
          activeClassName="rounded bg-trueGray-100 bg-opacity-20"
        >
          <Icon className="w-7.5 h-7" />
        </NavLink>
      ))}
    </nav>
  )
}

export default Sidebar
