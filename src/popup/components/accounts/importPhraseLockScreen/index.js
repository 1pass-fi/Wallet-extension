// modules
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

// components
import InputField from 'shared/inputField'
import TextAreaField from 'shared/textAreaField'
import Button from 'shared/button'
import Header from 'shared/header'

// constants
import { PATH, STORAGE } from 'constants/koiConstants'

// actions
import { importWallet } from 'actions/koi'
import { setError } from 'actions/error'
import { setIsLoading } from 'actions/loading'

// utils
import { getChromeStorage } from 'utils'
import { validatePhrase } from './utils'

// styles
import './index.css'


const ImportPhrase = ({ setError, importWallet, setIsLoading }) => {
  const history = useHistory()
  const [phrase, setPhrase] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const onPhraseChange = (e) => {
    setPhrase(e.target.value)
  }

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const onConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
  }

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      await validatePhrase({
        phrase,
        password,
        confirmPassword,
        history,
        setError,
        importWallet,
      })
      let redirectPath = PATH.IMPORT_PHRASE_REDIRECT
      redirectPath = ((await getChromeStorage(STORAGE.PENDING_REQUEST))[STORAGE.PENDING_REQUEST]) ? PATH.CONNECT_SITE : redirectPath

      setIsLoading(false)
      history.push(redirectPath)
    } catch (err) {
      setIsLoading(false)
      setError(err.message)
    }
  }

  return (
    <div className='seed-phrase-lock-screen'>
      <Header />
      <div className='content'>
        <div className='welcome'>Welcome</div>
        <TextAreaField
          type='password'
          className='seed-phrase field'
          name='inputPhrase'
          label='Paste your seed phrase'
          value={phrase}
          onChange={onPhraseChange}
        />
        <InputField
          className='password field'
          name='password'
          type='password'
          label='password'
          placeholder='Make it unique (min. 8 characters)'
          value={password}
          onChange={onPasswordChange}
        />
        <InputField
          className='confirm-password field'
          name='confirm-password'
          type='password'
          label='Confirm password'
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
        />
        <Button className='unlock-button' label='Unlock' onClick={onSubmit} />
        <div className='login-with-password'>
          Log in with my{' '}
          <Link className='password-link' to='/account/login'>
            password
          </Link>
        </div>
      </div>
    </div>
  )
}

export default connect(null, { setError, importWallet, setIsLoading })(ImportPhrase)
