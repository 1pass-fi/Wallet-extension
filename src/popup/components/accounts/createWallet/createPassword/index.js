import React, { useState } from 'react'
import { connect } from 'react-redux'

import CreatePassword from 'shared/createPassword'
import Card from 'shared/card'

import PlusIconOutline from 'img/plus-icon-outline.svg'

import { setError } from 'actions/error'

import './index.css'
import { validatePassword } from './utils'
import { setIsLoading } from 'actions/loading'
import { setCreatingWallet } from 'actions/creatingWallet'

export const Password = ({ generateWallet, setError, setIsLoading, setCreatingWallet }) => {

  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      setCreatingWallet(true) // show the creating wallet statement
      await validatePassword({ e, setError, generateWallet })
      setCreatingWallet(false)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setCreatingWallet(false)
      setError(err.message)
    }
  }
  return (
    <div className='stage1'>
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

export default connect(null, { setError, setIsLoading, setCreatingWallet })(Password)
