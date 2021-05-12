import React from 'react'

import CreatePassword from 'shared/createPassword'
import Card from 'shared/card'

import PlusIconOutline from 'img/plus-icon-outline.svg'

import './index.css'

export default ({ setStage, setPassword, setSeedPhrase, handleGenerateWallet }) => {
  const handleOnSubmit = async (e) => {
    e.preventDefault()
    try {
      const pwd = e.target.pwd.value
      const phrase = await handleGenerateWallet()
      setSeedPhrase(phrase)
      setPassword(pwd)
      setStage(2)
    } catch (err) {
      console.log(err.message)
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
