import React, { useState } from 'react'

import AccountDropdown from './AccountDropdown'
import Account from './Account'

import Avatar from 'img/popup/avatar-icon.svg'
import OptionIcon from 'img/popup/option-icon.svg'
import SettingIcon from 'img/popup/setting-icon.svg'

const Header = () => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)

  return (
    <div
      className="fixed flex"
      style={{ height: '54px', width: '100%', backgroundColor: '#8585BC' }}
    >
      <div className="relative">
        <Account
          showAccountDropdown={showAccountDropdown}
          setShowAccountDropdown={setShowAccountDropdown}
        />
        {showAccountDropdown && <AccountDropdown setShowAccountDropdown={setShowAccountDropdown} />}
      </div>
      <div className="bg-white flex items-center justify-center" style={{ width: '59px' }}>
        <SettingIcon style={{ width: '33px', height: '32px' }} />
      </div>
      <div
        className="bg-blue-800 flex items-center justify-center mr-0.25"
        style={{ width: '87px' }}
      >
        <Avatar className="mt-1.25" />
      </div>
      <div className="bg-blue-800 flex items-center justify-center" style={{ width: '30px' }}>
        <OptionIcon />
      </div>
    </div>
  )
}

export default Header
