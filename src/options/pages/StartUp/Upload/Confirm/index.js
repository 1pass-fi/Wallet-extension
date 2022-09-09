import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { TYPE } from 'constants/accountConstants'
import { ERROR_MESSAGE } from 'constants/koiConstants'
import isEmpty from 'lodash/isEmpty'
import { addAccountByAddress } from 'options/actions/accounts'
import { setActivatedChain } from 'options/actions/activatedChain'
import { setError } from 'options/actions/error'
import GoBackBtn from 'options/finnie-v1/components/GoBackButton'
import { GalleryContext } from 'options/galleryContext'
import { JSONFileToObject } from 'options/utils'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import storage from 'services/storage'

import ConfirmPassword from '../../shared/ConfirmPassword'
import InputPassword from '../../shared/InputPassword'

import './index.css'

export default ({ nextStep, file, walletType, selectedNetwork, previousStep }) => {
  const { setImportedAddress, setNewAddress } = useContext(GalleryContext)
  const [password, setPassword] = useState('')
  const [showFormError, setShowFormError] = useState(false)

  const dispatch = useDispatch()
  const accounts = useSelector((state) => state.accounts)

  const history = useHistory()

  const onConfirm = async () => {
    if (!password && isEmpty(accounts)) {
      setShowFormError(true)
      return
    }
    try {
      const key = await JSONFileToObject(file)

      // TODO: JSON validation
      // if (!key.n) throw new Error('Invalid JSON file')

      if (walletType === TYPE.ARWEAVE) selectedNetwork = null

      const address = await backgroundRequest.gallery.uploadJSONKeyFile({
        password,
        key,
        type: walletType,
        provider: selectedNetwork
      })

      /* 
        Set activated chain if this wallet is the first imported wallet
      */
      const totalAccount = await popupAccount.count()
      if (totalAccount === 1) {
        await storage.setting.set.activatedChain(walletType)
        dispatch(setActivatedChain(walletType))
      }

      setImportedAddress(address)
      setNewAddress(address)
      dispatch(addAccountByAddress(address))

      history.push({
        pathname: '/success',
        state: 'upload-key-state',
        type: walletType
      })
    } catch (err) {
      console.error(err.message)
      if (err.message === 'Incorrect password') {
        dispatch(setError(err.message))
        return
      }

      if (err.message === ERROR_MESSAGE.ACCOUNT_EXIST) {
        dispatch(setError(err.message))
        return
      }
      dispatch(setError(ERROR_MESSAGE.INVALID_JSON_KEY))
    }
  }

  return (
    <div className="upload-file confirm">
      <div className="title">Import a key with a .JSON file</div>
      {isEmpty(accounts) ? (
        <div className="description">
          Create a password for Finnie.
          <br />
          Make sure it is unique and secure.
        </div>
      ) : (
        <div className="description">
          Re-enter your Finnie password so we can securely store your new key.
        </div>
      )}

      {isEmpty(accounts) ? (
        <ConfirmPassword setPassword={setPassword} showError={showFormError} />
      ) : (
        <InputPassword setPassword={setPassword} />
      )}

      <button onClick={onConfirm} className="upload-file-button white-button">
        Import Key
      </button>
      <GoBackBtn goToPreviousStep={previousStep} />
    </div>
  )
}
