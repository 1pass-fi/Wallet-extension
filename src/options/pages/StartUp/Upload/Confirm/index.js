import React, { useState, useContext, useEffect } from 'react'

import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import { TYPE } from 'constants/accountConstants'
import { GalleryContext } from 'options/galleryContext'

import isEmpty from 'lodash/isEmpty'

import './index.css'

import { JSONFileToObject } from 'options/utils'
import ConfirmPassword from '../../shared/ConfirmPassword'
import InputPassword from '../../shared/InputPassword'
import {ERROR_MESSAGE} from 'constants/koiConstants'

export default ({ nextStep, file, walletType, selectedNetwork }) => {
  const { setError, wallets, setImportedAddress } =  useContext(GalleryContext)
  const [password, setPassword] = useState('')
  const onConfirm = async () => {
    try {
      const key = await JSONFileToObject(file)

      // TODO: JSON validation
      // if (!key.n) throw new Error('Invalid JSON file')

      const address = await backgroundRequest.gallery.uploadJSONKeyFile({ password, key, type: walletType, provider: selectedNetwork })
      setImportedAddress(address)
      nextStep()
    } catch (err) {
      console.log(err.message)
      setError(ERROR_MESSAGE.INVALID_JSON_KEY)
    }
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
