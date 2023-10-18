import React, { useEffect, useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import Avatar from 'img/popup/avatar-icon.svg'
import OptionIcon from 'img/popup/option-icon.svg'
import PauseIcon from 'img/popup/pause-icon.svg'
import PlayIcon from 'img/popup/play-icon.svg'
import SettingIcon from 'img/popup/setting-icon.svg'
import isEmpty from 'lodash/isEmpty'
import storage from 'services/storage'
import disableOrigin from 'utils/disableOrigin'

import Account from './Account'
import AccountDropdown from './AccountDropdown'

const Header = ({ setShowConnectedSites }) => {
  const defaultArweaveAccount = useSelector((state) => state.defaultAccount.AR)

  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [showPauseFinnieDropdown, setShowPauseFinnieDropdown] = useState(false)
  const [currentTabOrigin, setCurrentTabOrigin] = useState('')
  const [originDisabled, setOriginDisabled] = useState(false)

  const loadDisabledOrigins = () => {
    chrome.windows.getCurrent((w) => {
      try {
        const windowId = w.id
        chrome.tabs.query({ active: true }, (tab) => {
          tab = tab[0]
          const origin = tab.url.split('/')[0] + '//' + tab.url.split('/')[2]
          setCurrentTabOrigin(origin)
          storage.setting.get.disabledOrigins().then((disabledOrigins) => {
            setOriginDisabled(disabledOrigins.includes(origin))
          })
        })
      } catch (err) {}
    })
  }

  const goToSetting = () => {
    const url = chrome.runtime.getURL('options.html#/settings/wallet')
    chrome.tabs.create({ url })
  }

  const goToDID = () => {
    const DID = defaultArweaveAccount?.didData?.state?.kID
    const url = 'https://koii.id/' + (DID || '')
    chrome.tabs.create({ url })
  }

  const goToReportAnIssue = () => {
    const url = 'https://share.hsforms.com/1Nmy8p6zWSN2J2skJn5EcOQc20dg'
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

  const ref = useRef(null)
  const modalRef = useRef(null)
  const accountDropdownRef = useRef(null)

  useEffect(() => {
    loadDisabledOrigins()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && modalRef.current.contains(event.target)) {
        return
      } else if (ref.current && !ref.current.contains(event.target)) {
        setShowPauseFinnieDropdown(false)
      }
    }

    const handleClickOutsideAccountDropdown = (event) => {
      if (accountDropdownRef.current && accountDropdownRef.current.contains(event.target)) {
        return
      } else if (ref.current && !ref.current.contains(event.target)) {
        setShowAccountDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('mousedown', handleClickOutsideAccountDropdown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('mousedown', handleClickOutsideAccountDropdown)
    }
  }, [ref, modalRef, accountDropdownRef])

  return (
    <div
      className="fixed flex shadow-md z-50"
      style={{ height: '54px', backgroundColor: '#8585BC' }}
      ref={ref}
    >
      <div>
        <Account
          showAccountDropdown={showAccountDropdown}
          setShowAccountDropdown={setShowAccountDropdown}
        />
        {showAccountDropdown && (
          <AccountDropdown
            setShowAccountDropdown={setShowAccountDropdown}
            ref={accountDropdownRef}
          />
        )}
      </div>
      <div
        onClick={goToSetting}
        className="bg-white flex items-center justify-center cursor-pointer"
        style={{ width: '59px' }}
      >
        <SettingIcon style={{ width: '33px', height: '32px' }} />
      </div>
      {/* <div
        className="bg-blue-800 flex items-center justify-center mr-0.25 cursor-pointer"
        style={{ width: '87px' }}
        onClick={goToDID}
      >
        <Avatar className="mt-1.25" />
      </div> */}
      <div
        onClick={() => setShowPauseFinnieDropdown((prev) => !prev)}
        className="bg-blue-800 flex items-center justify-center cursor-pointer"
        style={{ width: '30px' }}
      >
        <OptionIcon />
      </div>
      <div className="z-50">
        {showPauseFinnieDropdown && (
          <div
            style={{ width: '252px', height: '92px', right: '0px', top: '54px' }}
            className="text-base text-white absolute"
            ref={modalRef}
          >
            <div
              style={{ height: '46px', paddingRight: '16px', zIndex: 100 }}
              className="bg-blue-800 hover:bg-blue-400 cursor-pointer flex items-center justify-end"
              onClick={() => {
                setShowConnectedSites(true)
                setShowPauseFinnieDropdown(false)
              }}
            >
              {chrome.i18n.getMessage('seeConnectedSites')}
            </div>
            <div
              onClick={handleDisableFinnie}
              style={{ height: '46px', paddingRight: '16px', borderBottom: '1px solid #8585BC' }}
              className="bg-blue-800 hover:bg-blue-400 cursor-pointer flex items-center justify-end"
            >
              <div className="flex items-center justify-center" style={{ marginRight: '6px' }}>
                {!originDisabled ? <PauseIcon /> : <PlayIcon />}
              </div>
              {!originDisabled ? chrome.i18n.getMessage('pauseFinnie') : chrome.i18n.getMessage('resumeFinnie')}
            </div>
            <div
              onClick={goToReportAnIssue}
              style={{ height: '46px', paddingRight: '16px', zIndex: 100 }}
              className="bg-blue-800 hover:bg-blue-400 cursor-pointer flex items-center justify-end"
            >
              {chrome.i18n.getMessage('reportAnIssue')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
