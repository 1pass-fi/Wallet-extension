import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import AccountDropdown from './AccountDropdown'
import Account from './Account'

import Avatar from 'img/popup/avatar-icon.svg'
import OptionIcon from 'img/popup/option-icon.svg'
import SettingIcon from 'img/popup/setting-icon.svg'

const Header = () => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const defaultAccount = useSelector((state) => state.defaultAccount)

  const goToSetting = () => {
    const url = chrome.extension.getURL('options.html#/settings/KID')
    chrome.tabs.create({ url })
  }

  const goToDID = () => {
    const DID = defaultAccount?.didData?.state?.kID
    const url = 'https://koii.id/' + (DID || '')
    chrome.tabs.create({ url })
  }

  return (
    <div
      className="fixed flex shadow-md z-30"
      style={{ height: '54px', width: '100%', backgroundColor: '#8585BC' }}
    >
      <div className="relative">
        <Account
          showAccountDropdown={showAccountDropdown}
          setShowAccountDropdown={setShowAccountDropdown}
        />
        {showAccountDropdown && <AccountDropdown setShowAccountDropdown={setShowAccountDropdown} />}
      </div>
      <div onClick={goToSetting} className="bg-white flex items-center justify-center cursor-pointer" style={{ width: '59px' }}>
        <SettingIcon style={{ width: '33px', height: '32px' }} />
      </div>
      <div
        className="bg-blue-800 flex items-center justify-center mr-0.25 cursor-pointer"
        style={{ width: '87px' }}
        onClick={goToDID}
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
