import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import { TYPE } from 'constants/accountConstants'
import { GalleryContext } from 'options/galleryContext'

import isEmpty from 'lodash/isEmpty'

import './index.css'

import { JSONFileToObject } from 'options/utils'
import ConfirmPassword from '../../shared/ConfirmPassword'
import InputPassword from '../../shared/InputPassword'
import {ERROR_MESSAGE} from 'constants/koiConstants'
import GoBackBtn from 'options/components/GoBackButton'


export default ({ nextStep, file, walletType, selectedNetwork, previousStep }) => {
  const { setError, setImportedAddress, setNewAddress } =  useContext(GalleryContext)
  const [password, setPassword] = useState('')
  const [showFormError, setShowFormError] = useState(false)

  const accounts = useSelector(state => state.accounts)

  const history = useHistory()

  const onConfirm = async () => {
    if(!password && isEmpty(accounts)) {
      setShowFormError(true)
      return
    }
    try {
      const key = await JSONFileToObject(file)

      // TODO: JSON validation
      // if (!key.n) throw new Error('Invalid JSON file')

      if (walletType === TYPE.ARWEAVE) selectedNetwork = null

      const address = await backgroundRequest.gallery.uploadJSONKeyFile({ password, key, type: walletType, provider: selectedNetwork })
      setImportedAddress(address)
      setNewAddress(address)

      history.push({
        pathname: '/success',
        state: 'upload-key-state'
      })
    } catch (err) {
      if (err.message === 'Incorrect password') {
        setError(err.message)
        return
      }

      if (err.message === ERROR_MESSAGE.ACCOUNT_EXIST) {
        setError(err.message)
        return
      }
      setError(ERROR_MESSAGE.INVALID_JSON_KEY)
    }
  }

  return (
    <div className='upload-file confirm'>
      <div className='title'>Import a key with a .JSON file</div>
      {isEmpty(accounts) ? <div className='description'>
        Create a password for Finnie.
        <br />
        Make sure it is unique and secure.
      </div>
        :
        <div className='description'>
        Confirm your Finnie password
        </div>
      }

      {isEmpty(accounts) ? <ConfirmPassword setPassword={setPassword} showError={showFormError}/> : <InputPassword setPassword={setPassword} />}

      <button
        onClick={onConfirm}
        className='upload-file-button white-button'
      >
        Import Key
      </button>
      <GoBackBtn goToPreviousStep={previousStep} />
    </div>
  )
}
