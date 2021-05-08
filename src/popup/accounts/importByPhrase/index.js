import React from 'react'

import './index.css'
import ImportIcon from 'img/import-icon.svg'
import Card from 'shared/card'
import InputField from 'shared/inputField'
import CreatePassword from 'shared/createPassword'


export default () => {
  return (
    <div className="account-import-phrase">
      <Card className="import-phrase">
        <div className="title">
          <ImportIcon />
          <p>Import a wallet</p>
        </div>
        <InputField label="12-word seed phrase" onChange={() => { }} placeholder="Paste seed phrase here" />
        <CreatePassword />
      </Card>
    </div>
  )
}
