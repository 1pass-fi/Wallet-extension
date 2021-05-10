import React, { useState, useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'

import InputField from '../inputField/index'
import ButtonShared from '../button/index'
import './index.css'

export default ({ onClick, isEnable }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const onConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
  }

  const isPasswordValid = useMemo(() => (password === confirmPassword) & !isEmpty(password), [password, confirmPassword])

  return (
    <div className="create-password">
      <div className="fields">
        <InputField label="New password" onChange={onPasswordChange} placeholder="Make it unique (min. 8 characters)" />
        <InputField label="Confirm password" onChange={onConfirmPasswordChange} placeholder="" />
      </div>
      <div className="term-service">
        <div className="checkbox">
          <input type="checkbox" />
        </div>
        <label>I agree with the <a href="#">Terms of Service</a></label>
      </div>
      <div className="button">
        <ButtonShared isEnable={isEnable & isPasswordValid} label="Import Wallet" />
      </div>
    </div>
  )
}
