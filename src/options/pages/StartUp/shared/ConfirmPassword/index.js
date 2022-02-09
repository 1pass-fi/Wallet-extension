import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import { URL } from 'constants/koiConstants'

import InputField from '../InputField'
import './index.css'

const passwordRegex = new RegExp('(?=.*[a-z].*)(?=.*[A-Z].*)(?=.*[0-9].*)(?=.*[!@#$%].*).{8,}')

export default ({ setPassword, showError }) => {
  const [tempPassword, setTempPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isAcceptTermService, setIsAcceptTermService] = useState(false)

  const isValid = passwordRegex.test(tempPassword)

  const isMatch = tempPassword === confirmPassword || !isValid

  useEffect(() => {
    if (isValid && isMatch && isAcceptTermService) {
      setPassword(tempPassword)
    } else {
      setPassword('')
    }
  }, [isValid, isMatch, isAcceptTermService])

  return (
    <>
      <InputField label={'New Password'} value={tempPassword} setValue={setTempPassword} />
      {showError && !isEmpty(tempPassword) && !isValid && (
        <div className="password-error">
          That password doesn't meet the requirements, please try again.
        </div>
      )}
      {showError && isEmpty(tempPassword) && (
        <div className="password-error">Please input your password.</div>
      )}

      <div className="requirements">
        <div>Requirements</div>
        <ul className="requirement-items">
          <div className="requirement-row">
            <div className="requirement-column">
              <li className="requirement-item">minimum 8 characters</li>
            </div>
            <div className="requirement-column">
              <li className="requirement-item">1 number</li>
            </div>
          </div>
          <div className="requirement-row">
            <div className="requirement-column">
              <li className="requirement-item">1 uppercase & 1 lowercase letter</li>
            </div>
            <div className="requirement-column">
              <li className="requirement-item">1 symbol (e.g. !@#$%)</li>
            </div>
          </div>
        </ul>
      </div>

      <InputField
        label={'Confirm Password'}
        value={confirmPassword}
        setValue={setConfirmPassword}
      />
      {showError && !isEmpty(confirmPassword) && !isMatch && (
        <div className="password-error">These passwords don't match, try entering them again.</div>
      )}
      {showError && isEmpty(confirmPassword) && (
        <div className="password-error">Please confirm your password.</div>
      )}
      <div className="term-of-service">
        <CheckBox
          checked={isAcceptTermService}
          onClick={() => setIsAcceptTermService((prev) => !prev)}
          theme="dark"
          className="w-3.75 h-3.75"
        />
        <div className="term-of-service-text">
          <label htmlFor="term-of-service">I agree with the&nbsp;</label>
          <a target="_blank" href={URL.TERM_OF_SERVICE} className="link">
            Terms of Service
          </a>
        </div>
      </div>
      {showError && !isAcceptTermService && (
        <div className="password-error">Please accept the Terms of Service.</div>
      )}
    </>
  )
}
