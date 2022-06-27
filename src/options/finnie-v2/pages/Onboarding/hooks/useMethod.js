import { popupBackgroundRequest as request } from 'services/request/popup'

const ERROR_MESSAGE = {
  SAVE_NEW_KEY_FAILED: 'Save new key failed',
  GENERATE_NEW_KEY_FAILED: 'Generate new key failed'
}

const useMethod = ({ 
  setIsLoading,
  setError,
  network, 
  password,
  newSeedphrase,
  setNewSeedphrase
}) => {
  const generateNewKey = async (network) => {
    try {
      setIsLoading(true)
      const seedphrase = await request.wallet.generateWallet({ walletType: network })
      setNewSeedphrase(seedphrase.join(' '))
      setIsLoading(false)
    } catch (err) {
      console.error(err.message)
      setError(ERROR_MESSAGE.GENERATE_NEW_KEY_FAILED)
    }
  }

  const saveNewKey = async () => {
    try {
      setIsLoading(true)
      await request.wallet.saveWallet({ seedPhrase: newSeedphrase, password })
      setIsLoading(false)
    } catch (err) {
      console.error(err.message)
      setError(ERROR_MESSAGE.SAVE_NEW_KEY_FAILED)
    }
  }

  const verifyPassword = async () => {
    try {
      setIsLoading(true)
      const isCorrectPassword = await request.wallet.verifyPassword({ password })
      setIsLoading(false)
      return isCorrectPassword
    } catch (err) {

    }
  }

  const importFromSeedphrase = async (seedphrase, network) => {
    try {
      setIsLoading(true)
      const address = await request.wallet.importWallet({ key: seedphrase, password, type: network })
      setIsLoading(false)
      return address
    } catch (err) {
      setError(err.message)
    }
  }

  return { generateNewKey, saveNewKey, verifyPassword, importFromSeedphrase }
}

export default useMethod
