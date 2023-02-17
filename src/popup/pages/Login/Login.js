// modules
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
// actions
import { unlockWallet } from 'actions/koi'
// constants
import { REQUEST } from 'constants/koiConstants'
import { MESSAGES } from 'constants/koiConstants'
import PauseIcon from 'img/popup/pause-icon.svg'
import PlayIcon from 'img/popup/play-icon.svg'
// assets
import KoiIcon from 'img/v2/koii-logos/finnie-koii-logo-transparent.svg'
import Background from 'img/v2/popup-bg.svg'
import ToggleViewPw from 'img/v2/popup-toggle-view-pw.svg'
import WarningIcon from 'img/v2/popup-warning.svg'
import { get, isUndefined } from 'lodash'
import { setError } from 'popup/actions/error'
import { setIsLoading } from 'popup/actions/loading'
// services
import storage from 'services/storage'
import disableOrigin from 'utils/disableOrigin'

const Login = ({ unlockWallet, setIsLoading, setError, setIsWalletLocked }) => {
  const history = useHistory()
  const inputRef = useRef(null)

  const [password, setPassword] = useState('')
  const [isIncorrectPassword, setIsIncorrectPassword] = useState(false)
  const [showPw, setShowPw] = useState(false)

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
      } catch (err) {
        console.error('loadDisabledOrigins', err)
      }
    })
  }

  useEffect(() => {
    loadDisabledOrigins()
  }, [])

  const toggleDisableFinnie = async () => {
    if (!originDisabled) {
      await disableOrigin.addDisabledOrigin(currentTabOrigin)
      setOriginDisabled(true)
    } else {
      await disableOrigin.removeDisabledOrigin(currentTabOrigin)
      setOriginDisabled(false)
    }
  }

  const handleOnSubmit = async () => {
    try {
      setIsLoading(true)
      const unlocked = await unlockWallet(password)
      setIsLoading(false)

      if (unlocked) {
        setIsWalletLocked(false)
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.ACCOUNTS_CHANGED })
        })

        history.push('/tokens')

        /* Reload gallery page after unlocked */
        chrome.tabs.query({ url: chrome.runtime.getURL('*') }, (tabs) => {
          tabs.map((tab) => tab.url.includes('options') && chrome.tabs.reload(tab.id))
        })
      } else {
        setIsIncorrectPassword(true)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const onPasswordChange = (e) => {
    setIsIncorrectPassword(false)
    setPassword(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleOnSubmit()
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="relative h-full min-h-screen text-blue-800">
      <Background className="absolute top-0 right-0" />
      <div className="w-full flex flex-col pt-38.75 items-center justify-center">
        <KoiIcon style={{ width: '117px' }} />
        <div className="text-4xl mt-2 text-center tracking-finnieSpacing-tightest leading-11">
          {chrome.i18n.getMessage('welcomeTo')}
          <br /> Finnie
        </div>
        <div className="mt-5.25 flex flex-col justify-start" style={{ width: '312px' }}>
          <div className="text-left text-sm mb-3">
            {chrome.i18n.getMessage('enterYourPassword')}
          </div>
          <div className="relative">
            <input
              className="w-full pl-2 pr-10 bg-trueGray-250 text-blue-800 h-7 rounded-t-sm border-b-2 border-blue-850 focus:outline-none tracking-wide"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={onPasswordChange}
              ref={inputRef}
              onKeyDown={(e) => handleKeyDown(e)}
            />
            <ToggleViewPw
              onClick={() => setShowPw((prev) => !prev)}
              className="w-6.75 cursor-pointer absolute top-1.75 right-2.25"
            />
          </div>
        </div>
        {isIncorrectPassword && (
          <div className="mt-3 py-1 bg-warning rounded-sm flex items-center justify-center w-50 text-sm">
            <WarningIcon className="w-4.25 h-4.25 mr-1.75" />
            {chrome.i18n.getMessage('PasswordIsIncorrect')}
          </div>
        )}
        <button
          className="my-3 w-50 h-9.75 text-white text-sm bg-blue-800 shadow-sm rounded-sm flex items-center justify-center"
          onClick={handleOnSubmit}
        >
          {chrome.i18n.getMessage('unlock')}
        </button>

        <div
          onClick={toggleDisableFinnie}
          className="cursor-pointer absolute w-full bottom-3.5 flex items-center justify-center text-xs"
        >
          {!originDisabled ? (
            <>
              <PauseIcon className="mr-1.75" /> {chrome.i18n.getMessage('pauseFinnie')}
            </>
          ) : (
            <>
              <PlayIcon className=" mr-1.75" /> {chrome.i18n.getMessage('resumeFinnie')}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default connect(null, { unlockWallet, setIsLoading, setError })(Login)
