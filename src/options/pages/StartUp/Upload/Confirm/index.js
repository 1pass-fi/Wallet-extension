import React, { useState } from 'react'
import { backgroundRequest } from 'popup/backgroundRequest'
import { TYPE } from 'account/accountConstants'


import './index.css'

import { JSONFileToObject } from 'options/utils'
import ConfirmPassword from '../../shared/ConfirmPassword'

export default ({ nextStep, file }) => {
  const [password, setPassword] = useState('')
  const onConfirm = async () => {
    const key = await JSONFileToObject(file)
    await backgroundRequest.gallery.uploadJSONKeyFile({ password, key, type: TYPE.ARWEAVE })
    // TODO: Handle password
    nextStep()
  }

  return (
    <div className='upload-file confirm'>
      <div className='title'>Import a key with a .JSON file</div>
      <div className='description'>
        Create a password for Finnie.
        <br />
        Make sure it is unique and secure.
      </div>

      <ConfirmPassword setPassword={setPassword} />

      <button
        disabled={!password}
        onClick={onConfirm}
        className='upload-file-button white-button'
      >
        Import Key
      </button>
    </div>
  )
}
