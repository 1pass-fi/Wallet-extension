import { useDispatch } from 'react-redux'
import { addAccountByAddress } from 'options/actions/accounts'
import { setActivatedChain } from 'options/actions/activatedChain'
import { setError } from 'options/actions/error'
import { setNewAddress } from 'options/actions/newAddress'
import {
  setOnboardingProcessed,
  setOnboardingProcessing
} from 'options/actions/onboardingProcessing'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as request } from 'services/request/popup'
import storage from 'services/storage'

const useMethod = ({ password, newSeedphrase, setNewSeedphrase }) => {
  const dispatch = useDispatch()

  const generateNewKey = async (network) => {
    try {
      dispatch(setOnboardingProcessing)
      const seedphrase = await request.wallet.generateWallet({ walletType: network })
      setNewSeedphrase(seedphrase.join(' '))
    } catch (err) {
      console.error(err.message)
      dispatch(setError(chrome.i18n.getMessage('generateNewKeyFailed')))
    } finally {
      dispatch(setOnboardingProcessed)
    }
  }

  const saveNewKey = async (network) => {
    try {
      dispatch(setOnboardingProcessing)
      const address = await request.wallet.saveWallet({ seedPhrase: newSeedphrase, password })

      await initActivatedChain(network)

      dispatch(setNewAddress(address))
      dispatch(addAccountByAddress(address))
    } catch (err) {
      console.error(err.message)
      dispatch(setError(chrome.i18n.getMessage('saveNewKeyFailed')))
    } finally {
      dispatch(setOnboardingProcessed)
    }
  }

  const verifyPassword = async () => {
    try {
      dispatch(setOnboardingProcessing)
      const isCorrectPassword = await request.wallet.verifyPassword({ password })
      return isCorrectPassword
    } catch (err) {
    } finally {
      dispatch(setOnboardingProcessed)
    }
  }

  const importFromSeedphrase = async (seedphrase, network) => {
    try {
      dispatch(setOnboardingProcessing)
      const address = await request.wallet.importWallet({
        key: seedphrase,
        password,
        type: network
      })

      await initActivatedChain(network)

      dispatch(setNewAddress(address))
      dispatch(addAccountByAddress(address))

      return address
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      dispatch(setOnboardingProcessed)
    }
  }

  const initActivatedChain = async (type) => {
    const totalAccount = await popupAccount.count()
    if (totalAccount === 1) {
      await storage.setting.set.activatedChain(type)
      dispatch(setActivatedChain(type))
    }
  }

  return { generateNewKey, saveNewKey, verifyPassword, importFromSeedphrase }
}

export default useMethod
