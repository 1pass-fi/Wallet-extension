import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as request } from 'services/request/popup'
import storage from 'services/storage'

import { addAccountByAddress } from 'options/actions/accounts'

import { GalleryContext } from 'options/galleryContext'

import { isArweaveAddress, isEthereumAddress, isSolanaAddress } from 'utils'

const ERROR_MESSAGE = {
  SAVE_NEW_KEY_FAILED: 'Save new key failed',
  GENERATE_NEW_KEY_FAILED: 'Generate new key failed'
}

const useMethod = ({ 
  password,
  newSeedphrase,
  setNewSeedphrase,
}) => {
  const { 
    setImportedAddress,
    setIsLoading,
    setError,
    setNewAddress,
    setActivatedChain
  } = useContext(GalleryContext)

  const dispatch = useDispatch()

  const generateNewKey = async (network) => {
    try {
      setIsLoading((prev) => ++prev)
      const seedphrase = await request.wallet.generateWallet({ walletType: network })
      setNewSeedphrase(seedphrase.join(' '))
    } catch (err) {
      console.error(err.message)
      setError(ERROR_MESSAGE.GENERATE_NEW_KEY_FAILED)
    } finally {
      setIsLoading((prev) => --prev)
    }
  }

  const saveNewKey = async () => {
    try {
      setIsLoading((prev) => ++prev)
      const address = await request.wallet.saveWallet({ seedPhrase: newSeedphrase, password })

      await initActivatedChain(address)

      setImportedAddress(address)
      setNewAddress(address)
      dispatch(addAccountByAddress(address))
    } catch (err) {
      console.error(err.message)
      setError(ERROR_MESSAGE.SAVE_NEW_KEY_FAILED)
    } finally {
      setIsLoading((prev) => --prev)
    }
  }

  const verifyPassword = async () => {
    try {
      setIsLoading((prev) => ++prev)
      const isCorrectPassword = await request.wallet.verifyPassword({ password })
      return isCorrectPassword
    } catch (err) {

    } finally {
      setIsLoading((prev) => --prev)
    }
  }

  const importFromSeedphrase = async (seedphrase, network) => {
    try {
      setIsLoading((prev) => ++prev)
      const address = await request.wallet.importWallet({ key: seedphrase, password, type: network })

      await initActivatedChain(address)

      setImportedAddress(address)
      setNewAddress(address)
      dispatch(addAccountByAddress(address))
      
      return address
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading((prev) => --prev)
    }
  }

  const initActivatedChain = async (address) => {
    let type
    if (isArweaveAddress(address)) type = 'TYPE_ARWEAVE'
    if (isEthereumAddress(address)) type = 'TYPE_ETHEREUM'
    if (isSolanaAddress(address)) type = 'TYPE_SOLANA'

    const totalAccount = await popupAccount.count()
    if (totalAccount === 1) {
      await storage.setting.set.activatedChain(type)
      setActivatedChain(type)
    }
  }

  return { generateNewKey, saveNewKey, verifyPassword, importFromSeedphrase }
}

export default useMethod
