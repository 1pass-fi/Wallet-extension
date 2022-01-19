// modules
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

// actions
import { lockWallet } from 'actions/koi'
import { setError } from 'actions/error'
import { setIsLoading } from 'popup/actions/loading'
import { setNotification } from 'popup/actions/notification'

// components
import GlobalButton from 'popup/components/shared/globalButton'
import AccountSettingRow from './accountSettingRow'

// constants
import { PATH } from 'constants/koiConstants'

// styles
import './index.css'
import disableOrigin from 'utils/disableOrigin'
import storage from 'services/storage'


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
