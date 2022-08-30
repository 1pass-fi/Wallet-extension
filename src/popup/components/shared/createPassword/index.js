// modules
import React from 'react'

import ButtonShared from '../button/index'
import CheckBox from '../checkbox'
// components
import InputField from '../inputField/index'

// styles
import './index.css'


export default  ({ isEnable, buttonLabel, setPassword, setConfirmPassword, setIsAccept }) => {
  // const [password, setPassword] = useState('')
  // const [confirmPassword, setConfirmPassword] = useState('')
  // const [_ , setIsAccept] = useState(false)

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const onConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
  }

  // const isPasswordValid = useMemo(
  //   () => (password === confirmPassword) & (password.length >= 8),
  //   [password, confirmPassword]
  // )

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
          <CheckBox
            defaultChecked={false}
            greenBackround={false}
            onChange={onCheckbox}
            className='term-service-checkbox'
            name='checkbox'
            id='check-terms'
          />
        </div>
        <label for='check-terms'>
          I agree with the{' '}
          <a target="_blank" href='https://koii.network/TOU_June_22_2021.pdf'>
            Terms of Service
          </a>
        </label>
      </div>
      <div className='button'>
        <ButtonShared
          label={buttonLabel ? buttonLabel : 'Import Wallet'}
          className='import-button'
        />
      </div>
    </div>
  )
}
