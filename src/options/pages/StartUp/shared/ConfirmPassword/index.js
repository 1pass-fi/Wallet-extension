import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import { URL } from 'constants/koiConstants'

import InputField from '../InputField'
import './index.css'

const passwordRegex = new RegExp(
  '(?=.*[a-z].*)(?=.*[A-Z].*)(?=.*[0-9].*)(?=.*[!@#$%].*).{8,}'
)

export default ({ setPassword }) => {
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
      <InputField
        label={'New Password'}
        value={tempPassword}
        setValue={setTempPassword}
      />
      {!isEmpty(tempPassword) && !isValid && (
        <div className="password-error">That password doesn't meet the requirements, please try again.</div>
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
              <li className="requirement-item">
                1 uppercase & 1 lowercase letter
              </li>
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
      {!isEmpty(confirmPassword) && !isMatch && (
        <div className="password-error">These passwords don't match, try entering them again.</div>
      )}

      <div className="term-of-service">
        <input
          id="term-of-service"
          type="checkbox"
          className="checkbox"
          value={isAcceptTermService}
          onChange={(e) => setIsAcceptTermService(e.target.checked)}
        />
        <div className="term-of-service-text">
          <label for="term-of-service">
            I agree with the&nbsp;
            <a target="_blank" href={URL.TERMS_OF_SERVICE} className="link">
              Terms of Service
            </a>
          </label>
        </div>
      </div>
    </>
  )
}