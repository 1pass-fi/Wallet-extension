import React from 'react'
import { useSelector } from 'react-redux'

import { NavLink } from 'react-router-dom'

import Balance from 'finnie-v2/components/Balance'
import DefaultAvatar from 'img/v2/default-avatar.svg'
import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-white.svg'
import NotificationIcon from 'img/v2/bell-icon.svg'

const NavBar = () => {
  const defaultAccount = useSelector((state) => state.defaultAccount)

  return (
    <header className="sticky top-0 z-50 w-full h-16 flex items-center bg-indigo-900 px-5.25 text-white text-sm justify-between">
      <div className="flex items-center">
        <KoiiLogo className="h-8 w-10.75" />
        <nav className="ml-6.25 tracking-finnieSpacing-wider">
          <NavLink to="/gallery">Gallery</NavLink>
        </nav>
      </div>

      <div className="flex items-center">
        <NotificationIcon className="h-5 w-3.75 mr-6.5" />
        <Balance koiiBalance={defaultAccount.koiBalance} arBalance={defaultAccount.balance} />
        <DefaultAvatar className="w-10 h-10 ml-6.5" />
      </div>
    </header>
  )
}

export default NavBar
