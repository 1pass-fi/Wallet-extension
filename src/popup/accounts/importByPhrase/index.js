import React, { useState, useContext } from 'react'
import isEmpty from 'lodash/isEmpty'

import './index.css'
import ImportIcon from 'img/import-icon.svg'
import Card from 'shared/card'
import InputField from 'shared/inputField'
import CreatePassword from 'shared/createPassword'
import Context from 'popup/context'


export default () => {
  const { handleImportWallet } = useContext(Context)
  const [phrase, setPharse] = useState('')

  const onPhraseChange = (e) => {
    setPharse(e.target.value)
  }

  return (
    <div className="account-import-phrase">
      <Card className="import-phrase">
        <div className="title">
          <ImportIcon />
          <p>Import a wallet</p>
        </div>
        <form onSubmit={handleImportWallet}>
          <InputField name="inputPhrase" label="12-word seed phrase" onChange={onPhraseChange} placeholder="Paste seed phrase here" />
          <CreatePassword isEnable={!isEmpty(phrase)} />
        </form>
      </Card>
    </div>
  )
}
