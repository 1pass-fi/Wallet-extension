// modules
import React from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

// actions
import { lockWallet } from 'actions/koi'
import { setError } from 'actions/error'
import { setIsLoading } from 'popup/actions/loading'

// components
import GlobalButton from 'popup/components/shared/globalButton'
import AccountSettingRow from './accountSettingRow'

// constants
import { PATH } from 'constants/koiConstants'

// styles
import './index.css'


const Setting = ({ lockWallet, setError, setIsLoading, accounts }) => {
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
    </div>
  )
}

const mapStateToProps = (state) => ({ accounts: state.accounts })

export default connect(mapStateToProps, { lockWallet, setError, setIsLoading })(Setting)
