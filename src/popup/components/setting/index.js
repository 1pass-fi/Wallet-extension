// modules
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setError } from 'actions/error'
// actions
import { lockWallet } from 'actions/koi'
// constants
import { PATH } from 'constants/koiConstants'
import { isEmpty } from 'lodash'
import { setIsLoading } from 'popup/actions/loading'
import { setNotification } from 'popup/actions/notification'
// components
import GlobalButton from 'popup/components/shared/globalButton'
import storage from 'services/storage'
import disableOrigin from 'utils/disableOrigin'

import AccountSettingRow from './accountSettingRow'

// styles
import './index.css'


const Setting = ({ lockWallet, setError, setIsLoading, accounts, setNotification }) => {
  const [currentTabOrigin, setCurrentTabOrigin] = useState('')

  const loadDisabledOrigins = () => {
    chrome.windows.getCurrent(w => {
      try {
        const windowId = w.id
        chrome.tabs.getSelected(windowId, tab => {
          const origin = tab.url.split('/')[0] + '//' + tab.url.split('/')[2]
          console.log('origin', origin)
          storage.setting.get.disabledOrigins().then(disabledOrigins => {
            if (disabledOrigins.includes(origin)) setCurrentTabOrigin(origin)
            else setCurrentTabOrigin('')
          })
        })
      } catch (err) {

      }
    })
  }

  useEffect(() => {
    loadDisabledOrigins()
  }, [])

  const history = useHistory()
  const handleOnClick = async () => {
    if (!isEmpty(accounts)) {
      setIsLoading(true)
      await lockWallet()
      setIsLoading(false)

      history.push(PATH.LOGIN)

      chrome.tabs.query({url: chrome.extension.getURL('*')}, tabs => {
        tabs.map(tab => chrome.tabs.reload(tab.id))
      })
    } else {
      setError('Cannot lock wallet.')
    }
  }

  const handleEnableFinnie = async () => {
    console.log('origin', currentTabOrigin)
    await disableOrigin.removeDisabledOrigin(currentTabOrigin)
    loadDisabledOrigins()
    setNotification('Page allowed')
  }

  return (
    <div className='setting-container'>
      <GlobalButton type='lock' className='lock' onClick={handleOnClick} />
      <div className='setting-mock-content'>
        {
          accounts.map(account =>
            <AccountSettingRow key={account.id} account={account} />
          )
        }
      </div>
      {currentTabOrigin && <div className='allow-finnie'><button onClick={handleEnableFinnie}>Allow Finnie on this page</button></div>}
    </div>
  )
}

const mapStateToProps = (state) => ({ accounts: state.accounts })

export default connect(mapStateToProps, { lockWallet, setError, setIsLoading, setNotification })(Setting)
