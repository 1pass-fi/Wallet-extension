import React, { useState } from 'react'

import KoiIcon from 'img/koi-logo-large.svg'
import InputField from 'shared/inputField'
import Button from 'shared/button'
import { Link } from 'react-router-dom'

import './index.css'

export default () => {
  const [password, setPassword] = useState('')

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const onSubmit = () => {
    console.log(password)
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
        <Button className='unlock-button' label={'Unlock'} onClick={onSubmit} />
        <div className='seed-phrase'>
          Import my account using my&nbsp;
          <Link to='/account/import/keyfile' className='link-to-seed-phrase'>
            seed phrase
          </Link>
          .
        </div>
      </div>
    </div>
  )
}
