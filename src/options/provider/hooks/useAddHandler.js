import  { useEffect } from 'react'
import { useStore, useDispatch } from 'react-redux'

import sendMessage from 'finnie-v2/utils/sendMessage'

import storage from 'services/storage'
import { popupBackgroundConnect } from 'services/request/popup'
import { popupAccount } from 'services/account'
import { EventHandler } from 'services/request/src/backgroundConnect'

import { loadAllAccounts } from 'options/actions/accounts'
import { setAssets } from 'options/actions/assets'
import { addNotification } from 'options/actions/notifications'

import { MESSAGES } from 'constants/koiConstants'


export default ({ setError, setModalStates, setNotification, setIsLoading, }) => {
  const store = useStore()
  const dispatch = useDispatch()

  useEffect(() => {
    const handleAddHandler = () => {
      const loadBalancesSuccess = new EventHandler(
        MESSAGES.GET_BALANCES_SUCCESS,
        async () => {
          try {
            const {
              defaultAccount: { AR, ETH }
            } = store.getState()
  
            const activatedAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
            let balancesUpdated = false
            if (!isEmpty(activatedAccountAddress)) {
              const activatedAccount = await popupAccount.getAccount({
                address: activatedAccountAddress
              })

              const activatedAccountData = await activatedAccount.get.metadata()
              const { balance, koiBalance } = activatedAccountData
              balancesUpdated = AR.balance !== balance || AR.koiBalance !== koiBalance
            } else {
              const activatedEthereumAccountAddress = await storage.setting.get.activatedEthereumAccountAddress()
              if (!isEmpty(activatedEthereumAccountAddress)) {
                const activatedAccount = await popupAccount.getAccount({
                  address: activatedEthereumAccountAddress
                })

                const activatedAccountData = await activatedAccount.get.metadata()
                const { balance, koiBalance } = activatedAccountData
                balancesUpdated = ETH.balance !== balance
              }
            }

            if (balancesUpdated) {
              await dispatch(loadAllAccounts())
              // sendMessage.success({ title: 'Balances updated', message: 'Your balances have been updated.' })
              setNotification('Your balances have been updated.')
            }

            console.log('defaultAccount', defaultAccount)
          } catch (err) {
            console.error(err.message)
            setError(err.message)
          }
        }
      )

      // reload all Finnie tabs when receive RELOAD_GALLERY message from background
      const reloadGalleryHandler = new EventHandler(
        MESSAGES.RELOAD_GALLERY,
        async () => {
          try {
            chrome.tabs.query({url: chrome.extension.getURL('*')}, tabs => {
              tabs.map(tab => chrome.tabs.reload(tab.id))
            })
          } catch (err) {
            console.log('reload gallery page - error: ', err)
          }
        }
      )
  
      const uploadNFTHandler = new EventHandler(
        MESSAGES.UPLOAD_NFT_SUCCESS,
        async () => {
          const { assets } = store.getState()

          try {
            setIsLoading(prev => ++prev)
            /* 
              Showing pending NFT
                - Get current activated account
                - Get pending assets for activated account
                - Set the pending NFT to cardInfo list
            */
            let activatedAccount = await storage.setting.get.activatedArweaveAccountAddress()
            activatedAccount = await popupAccount.getAccount({
              address: activatedAccount,
            })
            let pendingAssets = await activatedAccount.get.pendingAssets() || []

            pendingAssets = pendingAssets.filter(nft => {
              return assets.nfts.every(prevNft => nft.txId !== prevNft.txId)
            })

            dispatch(setAssets({ nfts: [...assets.nfts, ...pendingAssets], filteredNfts: [...assets.nfts, ...pendingAssets] }))

            setIsLoading(prev => --prev)
            setModalStates.setShowUploadingModal(false)
            setModalStates.setShowUploadedIcon(true)
            setModalStates.setShowSuccessUploadModal(true)
          } catch (err) {
            console.log('error: ', err)
          }
        }
      )

      const notificationHandler = new EventHandler(
        MESSAGES.PUSH_NOTIFICATIONS,
        async ({ payload: notification }) => {
          dispatch(addNotification(notification))
        }
      )
    
      popupBackgroundConnect.addHandler(loadBalancesSuccess)
      popupBackgroundConnect.addHandler(reloadGalleryHandler)
      popupBackgroundConnect.addHandler(uploadNFTHandler)
      popupBackgroundConnect.addHandler(notificationHandler)
    }
  
    handleAddHandler()
  }, [])
}
