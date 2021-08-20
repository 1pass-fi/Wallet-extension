import React, { useState, useContext } from 'react'

import { backgroundRequest } from 'popup/backgroundRequest'
import { TYPE } from 'account/accountConstants'
import { GalleryContext } from 'options/galleryContext'

import isEmpty from 'lodash/isEmpty'

import './index.css'

import { JSONFileToObject } from 'options/utils'
import ConfirmPassword from '../../shared/ConfirmPassword'
import InputPassword from '../../shared/InputPassword'

export default ({ nextStep, file, walletType }) => {
  const { wallets } =  useContext(GalleryContext)
  const [password, setPassword] = useState('')
  const onConfirm = async () => {
    const key = await JSONFileToObject(file)
    await backgroundRequest.gallery.uploadJSONKeyFile({ password, key, type: walletType })
    // TODO: Handle password
    nextStep()
  }

  return (
    <div className='upload-file confirm'>
      <div className='title'>Import a key with a .JSON file</div>
      {isEmpty(wallets) ? <div className='description'>
        Create a password for Finnie.
        <br />
        Make sure it is unique and secure.
      </div>
        :
        <div className='description'>
        Confirm your Finnie password
        </div>
      }

      {isEmpty(wallets) ? <ConfirmPassword setPassword={setPassword} /> : <InputPassword setPassword={setPassword} />}

      <button
        disabled={!password && isEmpty(wallets)}
        onClick={onConfirm}
        className='upload-file-button white-button'
      >
        Import Key
      </button>
    </div>
  )
}
