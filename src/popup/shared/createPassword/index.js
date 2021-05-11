import React, { useState, useMemo } from 'react'

import InputField from '../inputField/index'
import ButtonShared from '../button/index'
import './index.css'

export default ({ isEnable }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isAccept, setIsAccept] = useState(false)

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const onConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
  }

  const isPasswordValid = useMemo(
    () => (password === confirmPassword) & (password.length >= 8),
    [password, confirmPassword]
  )

  const onCheckbox = (e) => {
    setIsAccept(e.target.checked)
  }

  return (
    <div className='create-password'>
      <div className='fields'>
        <InputField
          label='New password'
          onChange={onPasswordChange}
          placeholder='Make it unique (min. 8 characters)'
        />
        <InputField
          label='Confirm password'
          onChange={onConfirmPasswordChange}
          placeholder=''
        />
      </div>
      <div className='term-service'>
        <div className='checkbox'>
          <input
            defaultValue={isAccept}
            onChange={onCheckbox}
            type='checkbox'
          />
        </div>
        <label>
          I agree with the <a href='#'>Terms of Service</a>
        </label>
      </div>
      <div className='button'>
        <ButtonShared
          isEnable={isEnable & isPasswordValid & isAccept}
          label='Import Wallet'
        />
      </div>
    </div>
  )
}
