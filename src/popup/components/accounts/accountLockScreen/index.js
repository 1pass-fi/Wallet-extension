import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { get } from 'lodash'

import KoiIcon from 'img/koi-logo-large.svg'
import InputField from 'shared/inputField'
import Button from 'shared/button'
import { Link } from 'react-router-dom'

import { unlockWallet } from 'actions/koi'
import { getChromeStorage } from 'utils'
import { STORAGE, REQUEST } from 'koiConstants'

import './index.css'
import { setIsLoading } from 'popup/actions/loading'

const LockScreen = ({ unlockWallet, setIsLoading }) => {
  const history = useHistory()

  const [password, setPassword] = useState('')

  const handleOnSubmit = async () => {
    await setIsLoading(true)
    unlockWallet(password)
    await setIsLoading(false)

    const storage = await getChromeStorage(STORAGE.PENDING_REQUEST)
    switch (get(storage[STORAGE.PENDING_REQUEST], 'type')) {
      case REQUEST.PERMISSION:
        history.push('/account/connect-site')
        break
      case REQUEST.TRANSACTION:
        history.push('/account/sign-transaction')
        break
      default:
        history.push('/account')
    }
  }

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div className='unlock-screen'>
      <div className='screen-header'>
        <KoiIcon width='130' height='130' className='koi-icon' />
        <div className='title'>Koi Wallet</div>
      </div>
      <div className='screen-content'>
        <div className='welcome'>Welcome back</div>
        <InputField
          className='input-password'
          label={'Enter your password'}
          value={password}
          onChange={onPasswordChange}
        />
        <Button
          className='unlock-button'
          label={'Unlock'}
          onClick={handleOnSubmit}
        />
        <div className='seed-phrase'>
          Import my account using my&nbsp;
          <Link to='/account/login/phrase' className='link-to-seed-phrase'>
            seed phrase
          </Link>
          {'.'}
        </div>
      </div>
    </div>
  )
}

export default connect(null, { unlockWallet, setIsLoading })(LockScreen)
