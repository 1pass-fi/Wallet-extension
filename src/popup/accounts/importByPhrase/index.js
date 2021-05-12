import React, { useState, useContext } from 'react'
import isEmpty from 'lodash/isEmpty'

import './index.css'
import ImportIcon from 'img/import-icon.svg'
import Card from 'shared/card'
import InputField from 'shared/inputField'
import CreatePassword from 'shared/createPassword'
import Context from 'popup/context'


export default () => {
  const { handleImportWallet, setError } = useContext(Context)
  const [phrase, setPharse] = useState('')

  const onPhraseChange = (e) => {
    setPharse(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      const password = e.target.pwd.value
      const passwordConfirm = e.target.pwdConfirm.value
      const checked = e.target.checkbox.checked
      const phrase = e.target.inputPhrase.value

      if (password.length < 8) {
        setError('Password must contain at least 8 characters')
      } else if (password !== passwordConfirm) {
        setError('Confirm Password does not match')
      } else if (!checked) {
        setError('You have to agree to the Terms of Service')
      } else if (!phrase) {
        setError('Seed phrase should not be empty')
      } else {
        handleImportWallet(e)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="account-import-phrase">
      <Card className="import-phrase">
        <div className="title">
          <ImportIcon />
          <p>Import a wallet</p>
        </div>
        <form onSubmit={handleSubmit}>
          <InputField name="inputPhrase" label="12-word seed phrase" onChange={onPhraseChange} placeholder="Paste seed phrase here" />
          <CreatePassword isEnable={!isEmpty(phrase)} />
        </form>
      </Card>
    </div>
  )
}
