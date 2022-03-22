import { useEffect } from 'react'
import isEmpty from 'lodash/isEmpty'

// services
import storage from 'services/storage'
import { popupAccount } from 'services/account'

// constants
import { REQUEST, DISCONNECTED_BACKGROUND, PATH } from 'constants/koiConstants'

const useLoadApp = ({
  history,
  accountLoaded,
  setDefaultAccount,
  setActivityNotifications,
  setNeedToReconnect,
  setError,
  setIsLoading,
  accounts,
  lockWallet
}) => {
  const loadApp = async () => {
    if (accountLoaded.isEmptyAccounts) {
      history.push('/account/welcome')
      return
    }
    if (accountLoaded.isWalletLocked) {
      history.push('/login')
    }

    const activatedEthereumAccountAddress = await storage.setting.get.activatedEthereumAccountAddress()
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

    const query = window.location.search // later we should refactor using react-hash-router

    /* 
        Load for activity notifications
      */
    const _activityNotifications = (await storage.generic.get.activityNotifications()) || []
    setActivityNotifications(_activityNotifications)

    /* 
        Load for pending request
      */
    const pendingRequest = await storage.generic.get.pendingRequest()

    /*
        When there's no imported account, redirect to welcome screen
        If not unlocked, redirect to lock screen
        Click on add account, go to welcome screen
      */
    try {
      if (pendingRequest) {
        switch (pendingRequest.type) {
          case REQUEST.PERMISSION:
            history.push(PATH.CONNECT_SITE)
            break
          case REQUEST.TRANSACTION:
            history.push(PATH.SIGN_TRANSACTION)
        }
      } else {
        history.push('/account')
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
      if (err.message === DISCONNECTED_BACKGROUND) {
        setNeedToReconnect(true)
      } else {
        setError(err.message)
      }
      setIsLoading(false)
    }
  }

  const handleLockWallet = async () => {
    if (!isEmpty(accounts)) {
      setIsLoading(true)
      await lockWallet()
      setIsLoading(false)

      history.push(PATH.LOGIN)

      chrome.tabs.query({ url: chrome.extension.getURL('*') }, (tabs) => {
        tabs.map((tab) => chrome.tabs.reload(tab.id))
      })
    } else {
      setError('Cannot lock wallet.')
    }
  }

  useEffect(() => {
    const load = async () => {
      await loadApp()
    }
    if (accountLoaded.accountLoaded) load()
  }, [accountLoaded.accountLoaded])

  return [handleLockWallet]
}

export default useLoadApp
