import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import AccountDropdown from './AccountDropdown'
import Account from './Account'

import storage from 'services/storage'

import Avatar from 'img/popup/avatar-icon.svg'
import OptionIcon from 'img/popup/option-icon.svg'
import SettingIcon from 'img/popup/setting-icon.svg'
import PauseIcon from 'img/popup/pause-icon.svg'
import PlayIcon from 'img/popup/play-icon.svg'

import disableOrigin from 'utils/disableOrigin'

const Header = () => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [showPauseFinnieDropdown, setShowPauseFinnieDropdown] = useState(false)
  const [currentTabOrigin, setCurrentTabOrigin] = useState('')
  const [originDisabled, setOriginDisabled] = useState(false)

  const defaultAccount = useSelector((state) => state.defaultAccount)

  const loadDisabledOrigins = () => {
    chrome.windows.getCurrent(w => {
      try {
        const windowId = w.id
        chrome.tabs.getSelected(windowId, tab => {
          const origin = tab.url.split('/')[0] + '//' + tab.url.split('/')[2]
          setCurrentTabOrigin(origin)
          storage.setting.get.disabledOrigins().then(disabledOrigins => {
            setOriginDisabled(disabledOrigins.includes(origin))
          })
        })
      } catch (err) {

      }
    })
  }

  const goToSetting = () => {
    const url = chrome.extension.getURL('options.html#/settings/KID')
    chrome.tabs.create({ url })
  }
  
  const goToDID = () => {
    const DID = defaultAccount?.didData?.state?.kID
    const url = 'https://koii.id/' + (DID || '')
    chrome.tabs.create({ url })
  }
  
  const handleDisableFinnie = async () => {
    if (!originDisabled) {
      await disableOrigin.addDisabledOrigin(currentTabOrigin)
      setOriginDisabled(true)
    } else {
      await disableOrigin.removeDisabledOrigin(currentTabOrigin)
      setOriginDisabled(false)
    }
  }
  
  useEffect(() => {
    loadDisabledOrigins()
  }, [])
  
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
      <div onClick={() => setShowPauseFinnieDropdown(prev => !prev)} onMouseEnter={() => setShowPauseFinnieDropdown(true)} className="bg-blue-800 flex items-center justify-center" style={{ width: '30px' }}>
        <OptionIcon />
      </div>
      {showPauseFinnieDropdown && <div style={{width:'252px',height:'92px',right:'0px',top:'54px'}} className='text-base text-white absolute bg-'>
        <div onClick={handleDisableFinnie} style={{height:'46px',paddingRight:'16px',borderBottom:'1px solid #8585BC'}} className='bg-blue-800 hover:bg-blue-400 cursor-pointer flex items-center justify-end'>
          <div className='flex items-center justify-center' style={{marginRight:'6px'}}>{!originDisabled ? <PauseIcon /> : <PlayIcon />}</div>
          {!originDisabled ? 'Pause Finnie on this site' : 'Resume Finnie'}
        </div>
        <div style={{height:'46px',paddingRight:'16px'}} className='bg-blue-800 hover:bg-blue-400 cursor-pointer flex items-center justify-end'>Report an Issue</div>
      </div>}
    </div>
  )
}

export default Header
