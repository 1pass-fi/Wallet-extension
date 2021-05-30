import React from 'react'
import { connect } from 'react-redux'

import CreatePassword from 'shared/createPassword'
import Card from 'shared/card'

import PlusIconOutline from 'img/plus-icon-outline.svg'

import { setError } from 'actions/error'

import './index.css'
import { validatePassword } from './utils'

export const Password = ({ generateWallet, setError }) => {
  const handleOnSubmit = (e) => {
    e.preventDefault()
    validatePassword({ e, setError, generateWallet })
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

export default connect(null, { setError })(Password)
