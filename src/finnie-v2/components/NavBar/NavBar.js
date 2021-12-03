import React from 'react'

import { NavLink } from 'react-router-dom'

import DefaultAvatar from 'img/v2/default-avatar.svg'
import KoiLogo from 'img/v2/finnie-koi-logo-white.svg'
import NotificationIcon from 'img/v2/bell-icon.svg'

const NavBar = () => {
  return (
    <header className="fixed w-full h-16 flex items-center bg-indigo-900 px-5.25 text-white text-sm justify-between">
      <div className="flex items-center">
        <KoiLogo className="h-8 w-10.75" />
        <nav className="ml-6.25">
          <NavLink to="/gallery">Gallery</NavLink>
        </nav>
      </div>

      <div className="flex gap-4 items-center">
        <NotificationIcon className="h-5 w-3.75" />
        <DefaultAvatar className="w-10 h-10" />
      </div>
    </header>
  )
}

export default NavBar
