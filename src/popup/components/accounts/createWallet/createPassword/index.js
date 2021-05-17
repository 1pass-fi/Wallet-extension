import React from 'react'
import { get } from 'lodash'

import CreatePassword from 'shared/createPassword'
import Card from 'shared/card'

import PlusIconOutline from 'img/plus-icon-outline.svg'

import { setError } from 'actions/error'
import { ERROR_MESSAGE } from 'constants'

import './index.css'

export default ({ generateWallet }) => {
  const handleOnSubmit = async (e) => {
    e.preventDefault()
    try {
      const pwd = get(e, 'target.pwd.value')
      const pwdConfirm = get(e, 'target.pwdConfirm.value')
      const checked = get(e, 'target.checkbox.checked')
      if (pwd.length < 8) {
        setError(ERROR_MESSAGE.PASSWORD_LENGTH)
      } else if (pwd !== pwdConfirm) {
        setError(ERROR_MESSAGE.PASSWORD_MATCH)
      } else if (!checked) {
        setError(ERROR_MESSAGE.CHECKED_TEMRS)
      } else {
        generateWallet({ stage: 2, password: pwd })
      }
    } catch (err) {
      setError(err.message)
    }
  }
  return (
    <div>
      <Card>
        <div className='title'>
          <PlusIconOutline />
          <p>Create a password</p>
        </div>
        <form onSubmit={handleOnSubmit}>
          <CreatePassword isEnable={true} buttonLabel={'Create Wallet'} />
        </form>
      </Card>
    </div>
  )
}
