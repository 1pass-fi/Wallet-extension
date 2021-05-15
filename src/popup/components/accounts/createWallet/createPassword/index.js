import React, { useContext } from 'react'

import CreatePassword from 'shared/createPassword'
import Card from 'shared/card'

import PlusIconOutline from 'img/plus-icon-outline.svg'

import Context from 'popup/context'

import './index.css'

export default ({ setStage, setPassword, setSeedPhrase, handleGenerateWallet }) => {
  const { setError } = useContext(Context)
  const handleOnSubmit = async (e) => {
    e.preventDefault()
    try {
      const pwd = e.target.pwd.value
      const pwdConfirm = e.target.pwdConfirm.value
      const checked = e.target.checkbox.checked
      if (pwd.length < 8) {
        setError('Password must contain at least 8 characters')
      } else if (pwd !== pwdConfirm) {
        setError('Confirm Password does not match')
      } else if (!checked) {
        setError('You have to agree with the Terms of Service')
      } else {
        const phrase = await handleGenerateWallet()
        setSeedPhrase(phrase)
        setPassword(pwd)
        setStage(2)
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
