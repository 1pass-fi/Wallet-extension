import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { get } from 'lodash'

import KoiIcon from 'img/koi-logo.svg'
import InputField from 'shared/inputField'
import Button from 'shared/button'
import { Link } from 'react-router-dom'

import { unlockWallet } from 'actions/koi'
import { getChromeStorage } from 'utils'
import { STORAGE, REQUEST } from 'koiConstants'

import './index.css'
import { setIsLoading } from 'popup/actions/loading'
import { setError } from 'popup/actions/error'
import storage from 'storage'


const LockScreen = ({ unlockWallet, setIsLoading, setError }) => {
  const history = useHistory()

  const [password, setPassword] = useState('')

  const handleOnSubmit = async () => {
    try {
      setIsLoading(true)
      const unlocked = await unlockWallet(password)
      setIsLoading(false)

      if (unlocked) {
        const pendingRequest = await storage.generic.get.pendingRequest()
        switch (get(pendingRequest, 'type')) {
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
    } catch (err) {
      setError(err.message)
    }
  }

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div className='unlock-screen'>
      <div className='screen-header'>
        <KoiIcon width='130' height='130' className='koi-icon' />
        <div className='title'>Koii Wallet</div>
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

export default connect(null, { unlockWallet, setIsLoading, setError })(LockScreen)
