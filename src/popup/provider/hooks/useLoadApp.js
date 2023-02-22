import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import setupLocale from '_locales'
// constants
import { REQUEST } from 'constants/koiConstants'
import isEmpty from 'lodash/isEmpty'
import { setText } from 'popup/actions/text'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
// services
import storage from 'services/storage'

const useLoadApp = ({
  history,
  setDefaultAccount,
  setActivityNotifications,
  setError,
  setIsLoading,
  accounts,
  setActivatedChain,
  setAccounts
}) => {
  const dispatch = useDispatch()

  const [showConnectSite, setShowConnectSite] = useState(false)
  const [showSigning, setShowSigning] = useState(false)
  const [showEthSigning, setShowEthSigning] = useState(false)
  const [showArSigning, setShowArSigning] = useState(false)
  const [showEthSignMessage, setShowEthSignMessage] = useState(false)
  const [showSignTypedDataV1, setShowSignTypedDataV1] = useState(false)
  const [showSignTypedDataV3, setShowSignTypedDataV3] = useState(false)
  const [showGetEcryptionKey, setShowGetEncryptionKey] = useState(false)
  const [accountLoaded, setAccountLoaded] = useState(false)
  const [isWalletLocked, setIsWalletLocked] = useState(false)
  const [showConnectedSites, setShowConnectedSites] = useState(false)

  const [loadAccountsDone, setLoadAccountsDone] = useState(false)
  const [loadDefaultAccountDone, setDefaultLoadAccountDone] = useState(false)

  const [showSolanaSignMessage, setShowSolanaSignMessage] = useState(false)

  const loadAccounts = async () => {
    try {
      setIsLoading(true)

      /* load locales */
      await (async () => {
        const t = await setupLocale()
        dispatch(setText(t))
      })()

      const activatedChain = await storage.setting.get.activatedChain()
      setActivatedChain(activatedChain)

      /* 
        load for wallet state of lock or unlock
        load for all accounts
      */
      await popupAccount.loadImported()
      let accounts = await popupAccount.getAllMetadata()

      setAccounts(accounts)

      const isLocked = await backgroundRequest.wallet.getLockState()
      setIsWalletLocked(isLocked)
    } catch (error) {
      console.log('Failed to load accounts: ', error.message)
    } finally {
      setLoadAccountsDone(true)
      setIsLoading(false)
    }
  }

  const loadDefaultAccounts = async () => {
    const activatedEthereumAccountAddress =
      await storage.setting.get.activatedEthereumAccountAddress()
    if (!isEmpty(activatedEthereumAccountAddress)) {
      const activatedEthereumAccount = await popupAccount.getAccount({
        address: activatedEthereumAccountAddress
      })

      if (!isEmpty(activatedEthereumAccount)) {
        const activatedEthereumAccountMetadata = await activatedEthereumAccount.get.metadata()
        setDefaultAccount(activatedEthereumAccountMetadata)
      }
    }

    const activatedAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
    if (!isEmpty(activatedAccountAddress)) {
      const activatedAccount = await popupAccount.getAccount({
        address: activatedAccountAddress
      })

      if (!isEmpty(activatedAccount)) {
        const activatedAccountMetadata = await activatedAccount.get.metadata()
        setDefaultAccount(activatedAccountMetadata)
      }
    }

    const activatedK2Address = await storage.setting.get.activatedK2AccountAddress()
    if (!isEmpty(activatedK2Address)) {
      const activatedAccount = await popupAccount.getAccount({
        address: activatedK2Address
      })

      if (!isEmpty(activatedAccount)) {
        const activatedAccountMetadata = await activatedAccount.get.metadata()
        setDefaultAccount(activatedAccountMetadata)
      }
    }

    const activatedSolanaAddress = await storage.setting.get.activatedSolanaAccountAddress()
    if (!isEmpty(activatedSolanaAddress)) {
      const activatedAccount = await popupAccount.getAccount({
        address: activatedSolanaAddress
      })

      if (!isEmpty(activatedAccount)) {
        const activatedAccountMetadata = await activatedAccount.get.metadata()
        setDefaultAccount(activatedAccountMetadata)
      }
    }

    setDefaultLoadAccountDone(true)
  }

  const loadActivities = async () => {
    const _activityNotifications = (await storage.generic.get.activityNotifications()) || []
    setActivityNotifications(_activityNotifications)
  }

  const handleRedirect = async () => {
    if (isEmpty(accounts)) {
      history.push('/account/welcome')
      return
    }
    if (isWalletLocked) {
      history.push('/login')
    }

    const pendingRequest = await storage.generic.get.pendingRequest()
    const query = window.location.search

    try {
      if (pendingRequest) {
        switch (pendingRequest.type) {
          case REQUEST.PERMISSION:
            setShowConnectSite(true)
            break
          case REQUEST.TRANSACTION:
            setShowSigning(true)
            break
          case REQUEST.ETH_TRANSACTION:
            setShowEthSigning(true)
            break
          case REQUEST.AR_TRANSACTION:
            setShowArSigning(true)
            break
          case REQUEST.PERSONAL_SIGN:
          case REQUEST.ETH_SIGN:
            setShowEthSignMessage(true)
            break
          case REQUEST.SIGN_TYPED_DATA_V1:
            setShowSignTypedDataV1(true)
            break
          case REQUEST.SIGN_TYPED_DATA_V3:
          case REQUEST.SIGN_TYPED_DATA_V4:
            setShowSignTypedDataV3(true)
            break
          case REQUEST.GET_ENCRYPTION_KEY:
            setShowGetEncryptionKey(true)
            break
          case REQUEST.SOLANA_SIGN_MESSAGE:
            setShowSolanaSignMessage(true)
            break
          case REQUEST.K2_SIGN_MESSAGE:
            setShowSolanaSignMessage(true)
            break
        }
      } else {
      }

      if (query.includes('create-wallet')) {
        const params = new URLSearchParams(query)
        const walletType = params.get('type')
        history.push(`/account/create?type=${walletType}`)
      } else if (query.includes('upload-json')) {
        const params = new URLSearchParams(query)
        const walletType = params.get('type')
        history.push(`/account/import/keyfile?type=${walletType}`)
      } else if (query.includes('upload-seedphrase')) {
        const params = new URLSearchParams(query)
        const walletType = params.get('type')
        history.push(`/account/import/phrase?type=${walletType}`)
      }
    } catch (err) {
      console.log(err.message)
      setError(err.message)
      setIsLoading(false)
    }
  }

  const handleLockWallet = async () => {
    if (!isEmpty(accounts)) {
      setIsLoading(true)
      await lockWallet()
      setIsLoading(false)

      history.push(PATH.LOGIN)

      chrome.tabs.query({ url: chrome.runtime.getURL('*') }, (tabs) => {
        tabs.map((tab) => chrome.tabs.reload(tab.id))
      })
    } else {
      setError(chrome.i18n.getMessage('cannotLockWallet'))
    }
  }

  useEffect(() => {
    loadAccounts()
    loadDefaultAccounts()
    loadActivities()
  }, [])

  useEffect(() => {
    if (loadAccountsDone && loadDefaultAccountDone) setAccountLoaded(true)
  }, [loadAccountsDone, loadDefaultAccountDone])

  useEffect(() => {
    if (accountLoaded) handleRedirect()
  }, [accountLoaded])

  return {
    showConnectSite,
    setShowConnectSite,
    showSigning,
    setShowSigning,
    showEthSigning,
    setShowEthSigning,
    showArSigning,
    setShowArSigning,
    showEthSignMessage,
    showSignTypedDataV1,
    showSignTypedDataV3,
    showGetEcryptionKey,
    accountLoaded,
    showConnectedSites,
    setShowConnectedSites,
    showSolanaSignMessage,
    loadDefaultAccounts,
    isWalletLocked,
    setIsWalletLocked
  }
}

export default useLoadApp
