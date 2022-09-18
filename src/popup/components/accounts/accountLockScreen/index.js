// modules
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
// actions
import { unlockWallet } from 'actions/koi'
// constants
import { REQUEST } from 'constants/koiConstants'
// assets
import KoiIcon from 'img/koi-logo.svg'
import { get } from 'lodash'
import { setError } from 'popup/actions/error'
import { setIsLoading } from 'popup/actions/loading'
// services
import storage from 'services/storage'
import Button from 'shared/button'
// components
import InputField from 'shared/inputField'

// styles
import './index.css'


const LockScreen = ({ unlockWallet, setIsLoading, setError }) => {
  const history = useHistory()

  const [password, setPassword] = useState('')

  const inputRef = useRef(null)

  const handleOnSubmit = async () => {
    try {
      setIsLoading(true)
      const unlocked = await unlockWallet(password)
      setIsLoading(false)

      if (unlocked) {
        history.push('/tokens')

        /* Reload gallery page after unlock */
        chrome.tabs.query({url: chrome.extension.getURL('*')}, tabs => {
          tabs.map(tab => tab.url.includes('options') && chrome.tabs.reload(tab.id))
        })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
          ref={inputRef}
        />
        <Button
          className='unlock-button'
          label={'Unlock'}
          onClick={handleOnSubmit}
        />
        {/* <div className='seed-phrase'>
          Import my account using my&nbsp;
          <Link to='/account/login/phrase' className='link-to-seed-phrase'>
            seed phrase
          </Link>
          {'.'}
        </div> */}
      </div>
    </div>
  )
}

export default connect(null, { unlockWallet, setIsLoading, setError })(LockScreen)
