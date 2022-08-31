import React, { useEffect, useMemo,useRef, useState } from 'react'
import ReactNotification from 'react-notifications-component'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { TYPE } from 'constants/accountConstants'
import { GALLERY_IMPORT_PATH } from 'constants/koiConstants'
import find from 'lodash/find'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { loadAllAccounts, loadAllFriendReferralData } from 'options/actions/accounts'
import { setAssets } from 'options/actions/assets'
import { setCollections } from 'options/actions/collections'
import { setDefaultAccount } from 'options/actions/defaultAccount'
import { setNotifications } from 'options/actions/notifications'
import { DidContext } from 'options/context'
import LockScreen from 'options/finnie-v1/components/lockScreen'
import Message from 'options/finnie-v1/components/message'
import { GalleryContext } from 'options/galleryContext'
import ExportNFT from 'options/modal/exportNFT'
import SelectAccountModal from 'options/modal/SelectAccountModal'
import ShareNFT from 'options/modal/shareNFT'
import TransferNFT from 'options/modal/TransferNFT'
import Welcome from 'options/modal/welcomeScreen'
import StartUp from 'options/pages/StartUp'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import storage from 'services/storage'

import useAddHandler from './hooks/useAddHandler'
import useDID from './hooks/useDID'
import useError from './hooks/useError'
import useModal from './hooks/useModal'
import { useNfts } from './hooks/useNfts'
import useSetting from './hooks/useSetting'

import 'react-notifications-component/dist/theme.css'
import './index.css'

export default ({ children }) => {
  const { pathname } = useLocation()

  /* 
    Local state
  */
  const [isLocked, setIsLocked] = useState(false)

  /* 
    Create collection states
  */
  const [showCreateCollection, setShowCreateCollection] = useState(false) // show create collection on home page

  /* 
    Notification state
  */
  const [isLoading, setIsLoading] = useState(0) // loading state

  const [isProcessing, setIsProcessing] = useState(0) // onboarding processing state

  const [notification, setNotification] = useState(null) // notification message

  /* 
    Import new account
  */
  const [importedAddress, setImportedAddress] = useState(null) // just imported account
  const [newAddress, setNewAddress] = useState(null) // just imported address
  const [isOnboarding, setIsOnboarding] = useState(false) // keep reveal page - onboarding flow

  /* 
    File
  */
  const [isDragging, setIsDragging] = useState(false) // ???
  const [file, setFile] = useState({}) // file for create nft

  const [searchTerm, setSearchTerm] = useState('') // search bar

  const [selectedNftIds, setSelectedNftIds] = useState([])

  const dispatch = useDispatch()

  /* HOOKS */
  const [walletLoaded, setWalletLoaded] = useState(false)
  const [error, setError] = useError()
  const [didStates, setDIDStates] = useDID({ newAddress, walletLoaded, setIsLoading, setError })
  const [modalStates, setModalStates] = useModal()
  const [settingStates, setSettingStates] = useSetting({ walletLoaded })

  useAddHandler({ setError, setNotification, setModalStates, setIsLoading })
  useNfts({ setCollections, setIsLoading, walletLoaded, newAddress, pathname })

  /* 
    GET STATE FROM STORE
  */
  const accounts = useSelector((state) => state.accounts)
  const defaultAccount = useSelector((state) => state.defaultAccount.AR)
  const assets = useSelector((state) => state.assets)
  const _defaultAccount = useSelector((state) => state.defaultAccount)

  /* 
    Activated chain
  */
  const [activatedChain, setActivatedChain] = useState(TYPE.K2)

  useEffect(() => {
    const loadActivatedChain = async () => {
      const activatedChain = await storage.setting.get.activatedChain()
      if (activatedChain) setActivatedChain(activatedChain)
    }

    loadActivatedChain()
  }, [])

  /* 
      Account to display
    */
  const displayingAccount = useMemo(() => {
    if (activatedChain === TYPE.ARWEAVE) return _defaultAccount.AR
    if (activatedChain === TYPE.ETHEREUM) return _defaultAccount.ETH
    if (activatedChain === TYPE.SOLANA) return _defaultAccount.SOL
    if (activatedChain === TYPE.K2) return _defaultAccount.K2
  }, [
    _defaultAccount.AR,
    _defaultAccount.ETH,
    _defaultAccount.SOL,
    _defaultAccount.K2,
    activatedChain
  ])

  /* EDITING COLLECTION ID */
  const [editingCollectionId, setEditingCollectionId] = useState(null)

  const onCloseUploadModal = () => {
    setFile({})
    setIsDragging(false)
  }

  const handleShareNFT = (txId) => {
    const toShareNFT = find(assets.nfts, { txId })
    setModalStates.setShowTransferNFT({ show: true, cardInfo: toShareNFT })
  }

  const refreshNFTs = async () => {
    let allAssets = await popupAccount.getAllAssets()
    let validAssets = allAssets.filter((asset) => asset.name !== '...')

    console.log('validAssets', validAssets.length)

    dispatch(setAssets({ nfts: validAssets }))
  }

  /* 
    STEP 1:
    - Load accounts from chrome storage
  */
  useEffect(() => {
    const loadWallets = async () => {
      setIsLoading((prev) => ++prev)
      const allAccounts = await dispatch(loadAllAccounts()) // will load default account also
      const _isLocked = await backgroundRequest.wallet.getLockState()

      setWalletLoaded(true)
      // go to lock screen if having imported account
      if (!isEmpty(allAccounts)) {
        setIsLocked(_isLocked)
      }
      setIsLoading((prev) => --prev)
    }
    loadWallets()
  }, [])

  /*
    STEP 2: 
  */

  useEffect(() => {
    const getAffiliateCode = () => {
      dispatch(loadAllFriendReferralData())
    }

    const loadNotifications = async () => {
      const allNotifications = await storage.generic.get.pushNotification()
      console.log('all notificatoin =======', allNotifications)
      dispatch(setNotifications(allNotifications))
    }

    if (walletLoaded) {
      getAffiliateCode()
      loadNotifications()
    }
  }, [walletLoaded])

  /* 
    Reload wallets when a new wallet just imported
  */
  useEffect(() => {
    const updateAccounts = async () => {
      await popupAccount.loadImported()

      /* 
        Set default account if imported account is the first account
      */
      if (get(popupAccount, 'importedAccount.length') === 1) {
        let activatedAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
        if (!isEmpty(activatedAccountAddress)) {
          let activatedAccount = await popupAccount.getAccount({
            address: activatedAccountAddress
          })
          activatedAccount = await activatedAccount.get.metadata()
          dispatch(setDefaultAccount(activatedAccount))
        }

        let activatedEthereumAccountAddress = await storage.setting.get.activatedEthereumAccountAddress()
        if (!isEmpty(activatedEthereumAccountAddress)) {
          let activatedEthereumAccount = await popupAccount.getAccount({
            address: activatedEthereumAccountAddress
          })
          activatedEthereumAccount = await activatedEthereumAccount.get.metadata()
          dispatch(setDefaultAccount(activatedEthereumAccount))
        }

        let activatedSolanaAccountAddress = await storage.setting.get.activatedSolanaAccountAddress()
        if (!isEmpty(activatedSolanaAccountAddress)) {
          let activatedSolanaAccount = await popupAccount.getAccount({
            address: activatedSolanaAccountAddress
          })
          activatedSolanaAccount = await activatedSolanaAccount.get.metadata()
          dispatch(setDefaultAccount(activatedSolanaAccount))
        }

        let activatedK2AccountAddress = await storage.setting.get.activatedK2AccountAddress()
        if (!isEmpty(activatedK2AccountAddress)) {
          let activatedK2Account = await popupAccount.getAccount({
            address: activatedK2AccountAddress
          })
          activatedK2Account = await activatedK2Account.get.metadata()
          dispatch(setDefaultAccount(activatedK2Account))
        }
      }
    }

    const loadDID = async () => {
      backgroundRequest.gallery.getDID({ address: newAddress })
    }

    if (newAddress) {
      loadDID()
      updateAccounts()
      dispatch(loadAllFriendReferralData())
    }
  }, [newAddress])

  /* 
    On open create collection form, allAssets list should be set to assets of the 
    activated account.
    This action happens for the purpose of to prevent user from creating collection that contains
    an NFTs from another account - in case they imported more than one account.
  */
  useEffect(() => {
    const setAssetsForCreateCollection = async () => {
      const _account = await popupAccount.getAccount({
        address: defaultAccount.address
      })
      let assets = await _account.get.assets()
      assets = assets.filter((asset) => asset.name !== '...')
      dispatch(setAssets({ nfts: assets }))
    }

    if (showCreateCollection) setAssetsForCreateCollection()
  }, [showCreateCollection, defaultAccount])

  /*
    Redirect to create NFT page to support create new NFT in case import new wallet
  */
  useEffect(() => {
    // if (!isEmpty(file)) history.push('/create')
  }, [file])

  /* 
    set state timer
  */

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const updateDefaultAccountData = async () => {
    let activatedAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
    if (!isEmpty(activatedAccountAddress)) {
      let activatedAccount = await popupAccount.getAccount({
        address: activatedAccountAddress
      })
      activatedAccount = await activatedAccount.get.metadata()
      dispatch(setDefaultAccount(activatedAccount))
    }

    let activatedEthereumAccountAddress = await storage.setting.get.activatedEthereumAccountAddress()
    if (!isEmpty(activatedEthereumAccountAddress)) {
      let activatedEthereumAccount = await popupAccount.getAccount({
        address: activatedEthereumAccountAddress
      })
      activatedEthereumAccount = await activatedEthereumAccount.get.metadata()
      dispatch(setDefaultAccount(activatedEthereumAccount))
    }

    let activatedSolanaAccountAddress = await storage.setting.get.activatedSolanaAccountAddress()
    if (!isEmpty(activatedSolanaAccountAddress)) {
      let activatedSolanaAccount = await popupAccount.getAccount({
        address: activatedSolanaAccountAddress
      })
      activatedSolanaAccount = await activatedSolanaAccount.get.metadata()
      dispatch(setDefaultAccount(activatedSolanaAccount))
    }

    let activatedK2AccountAddress = await storage.setting.get.activatedK2AccountAddress()
    if (!isEmpty(activatedK2AccountAddress)) {
      let activatedK2Account = await popupAccount.getAccount({
        address: activatedK2AccountAddress
      })
      activatedK2Account = await activatedK2Account.get.metadata()
      dispatch(setDefaultAccount(activatedK2Account))
    }
  }

  useEffect(() => {
    updateDefaultAccountData()
  }, [])

  return (
    <GalleryContext.Provider
      value={{
        displayingAccount,
        setActivatedChain,
        handleShareNFT,
        onCloseUploadModal,
        searchTerm,
        setError,
        setFile,
        isLoading,
        setIsLoading,
        isProcessing,
        setIsProcessing,
        setNotification,
        setSearchTerm,
        setShowCreateCollection,
        showCreateCollection,
        importedAddress,
        setImportedAddress,
        setNewAddress,
        setIsOnboarding,
        walletLoaded,
        refreshNFTs,
        selectedNftIds,
        setSelectedNftIds,
        editingCollectionId,
        setEditingCollectionId,
        ...modalStates,
        ...setModalStates,
        ...settingStates,
        ...setSettingStates
      }}
    >
      <DidContext.Provider
        value={{
          ...didStates,
          ...setDIDStates
        }}
      >
        <div className="app-background">
          {!isEmpty(accounts) && !isOnboarding ? (
            <>
              {!isLocked ? (
                <div
                  onDragOver={() => modifyDraging(true)}
                  onDragLeave={() => modifyDraging(false)}
                  onClick={(e) => {
                    if (e.target.className === 'modal-container') {
                      setModalStates.setShowShareModal(false)
                      setModalStates.setShowExportModal(false)
                      setSettingStates.setShowWelcome(false)
                    }
                  }}
                >
                  {error && <Message children={error} />}
                  {notification && !GALLERY_IMPORT_PATH.includes(pathname) && (
                    <Message children={notification} type="notification" />
                  )}
                  {modalStates.showShareModal.show && (
                    <ShareNFT
                      txid={modalStates.showShareModal.txid}
                      onClose={() => {
                        setModalStates.setShowShareModal({
                          ...modalStates.showShareModal,
                          show: false
                        })
                      }}
                    />
                  )}
                  {!isEmpty(modalStates.showExportModal) && (
                    <ExportNFT
                      info={modalStates.showExportModal}
                      onClose={() => {
                        setModalStates.setShowExportModal(false)
                      }}
                    />
                  )}

                  {modalStates.showTransferNFT.show && (
                    <TransferNFT
                      cardInfo={modalStates.showTransferNFT.cardInfo}
                      onClose={() => {
                        setModalStates.setShowTransferNFT({ show: false })
                      }}
                    />
                  )}

                  {settingStates.showWelcome && (
                    <Welcome
                      onClose={() => {
                        setSettingStates.setShowWelcome(false)
                      }}
                    />
                  )}
                  {modalStates.showSelectAccount && (
                    <SelectAccountModal
                      onClose={() => {
                        setModalStates.setShowSelectAccount(false)
                      }}
                    />
                  )}
                  {children}
                </div>
              ) : (
                <LockScreen />
              )}
            </>
          ) : (
            <>
              {walletLoaded && (
                <div>
                  {error && <Message children={error} />}
                  <StartUp />
                </div>
              )}
            </>
          )}
        </div>
        <ReactNotification />
      </DidContext.Provider>
    </GalleryContext.Provider>
  )
}
