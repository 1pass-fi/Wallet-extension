import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'

// services
import storage from 'services/storage'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import { popupAccount } from 'services/account'

const useAccountLoaded = ({ history, setIsLoading, setAccounts, setActivatedChain }) => {
  const [accountLoaded, setAccountLoaded] = useState(false)
  const [isEmptyAccounts, setIsEmptyAccounts] = useState(true)
  const [isWalletLocked, setIsWalletLocked] = useState(true)

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setIsLoading(true)

        const activatedChain = await storage.setting.get.activatedChain()
        setActivatedChain(activatedChain)

        /* 
          load for wallet state of lock or unlock
          load for all accounts
        */
        await popupAccount.loadImported()
        let accounts = await popupAccount.getAllMetadata()

        setAccounts(accounts)

        if (!isEmpty(accounts)) {
          setIsEmptyAccounts(false)
        }

        const isLocked = await backgroundRequest.wallet.getLockState()
        setIsWalletLocked(isLocked)

        setAccountLoaded(true)
        setIsLoading(false)
      } catch (error) {
        console.log('Failed to load accounts: ', error.message)
      }
    }
    loadAccounts()
  }, [])

  return [
    { accountLoaded, isEmptyAccounts, isWalletLocked },
    { setAccountLoaded, setIsEmptyAccounts, setIsWalletLocked }
  ]
}

export default useAccountLoaded
