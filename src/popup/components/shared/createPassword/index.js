import React, { useState, useMemo } from 'react'

import InputField from '../inputField/index'
import ButtonShared from '../button/index'
import './index.css'

export default ({ isEnable, buttonLabel }) => {
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
          name='pwd'
        />
        <InputField
          label='Confirm password'
          onChange={onConfirmPasswordChange}
          placeholder=''
          name='pwdConfirm'
        />
      </div>
      <div className='term-service'>
        <div className='checkbox'>
          <input
            defaultValue={isAccept}
            onChange={onCheckbox}
            type='checkbox'
            name='checkbox'
          />
        </div>
        <label>
          I agree with the <a href='#'>Terms of Service</a>
        </label>
      </div>
      <div className='button'>
        <ButtonShared
          label={buttonLabel ? buttonLabel : 'Import Wallet'}
        />
      </div>
    </div>
  )
}
