import '@babel/polyfill'
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector, useStore } from 'react-redux'

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import useError from './hooks/useError'
import useDID from './hooks/useDID'
import useModal from './hooks/useModal'
import useSetting from './hooks/useSetting'
import useAddHandler from './hooks/useAddHandler'

import isEmpty from 'lodash/isEmpty'
import throttle from 'lodash/throttle'
import get from 'lodash/get'
import find from 'lodash/find'

import { GALLERY_IMPORT_PATH, MESSAGES, FRIEND_REFERRAL_ENDPOINTS } from 'constants/koiConstants'
import sendMessage from 'finnie-v2/utils/sendMessage'
import classifyAssets from 'finnie-v2/utils/classifyAssets'

import './index.css'
import StartUp from 'options/pages/StartUp'
import Message from 'options/finnie-v1/components/message'
import LockScreen from 'options/finnie-v1/components/lockScreen'

import { GalleryContext } from 'options/galleryContext'
import { DidContext } from 'options/context'

import ShareNFT from 'options/modal/shareNFT'
import ExportNFT from 'options/modal/exportNFT'
import Welcome from 'options/modal/welcomeScreen'
import TransferNFT from 'options/modal/TransferNFT'

import storage from 'services/storage'
import {
  popupBackgroundRequest as backgroundRequest,
  popupBackgroundConnect
} from 'services/request/popup'

import { popupAccount } from 'services/account'
import SelectAccountModal from 'options/modal/SelectAccountModal'

import { EventHandler } from 'services/request/src/backgroundConnect'

import { loadAllAccounts, loadAllFriendReferralData } from 'options/actions/accounts'
import { setDefaultAccount } from 'options/actions/defaultAccount'
import { setCollections } from 'options/actions/collections'
import { setAssets, setCollectionNfts } from 'options/actions/assets'
import { addNotification, setNotifications } from 'options/actions/notifications'

export default ({ children }) => {
  const { pathname } = useLocation()
  const history = useHistory()

  const inputFileRef = useRef(null)

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

  const [notification, setNotification] = useState(null) // notification message

  /* 
    Import new account
  */
  const [importedAddress, setImportedAddress] = useState(null) // just imported account
  const [newAddress, setNewAddress] = useState(null) // just imported address

  /* 
    File
  */
  const [isDragging, setIsDragging] = useState(false) // ???
  const [file, setFile] = useState({}) // file for create nft
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: ['image/*', 'video/*', 'audio/*'],
    noClick: true
  })

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

  /* 
    GET STATE FROM STORE
  */
  const accounts = useSelector((state) => state.accounts)
  const defaultAccount = useSelector((state) => state.defaultAccount.AR)
  const assets = useSelector((state) => state.assets)

  /* EDITING COLLECTION ID */
  const [editingCollectionId, setEditingCollectionId] = useState(null)

  const onClearFile = () => {
    setFile({})
    inputFileRef.current.value = null
  }

  const onCloseUploadModal = () => {
    setFile({})
    setIsDragging(false)
  }

  const modifyDraging = useCallback(
    throttle((newValue) => {
      setIsDragging(newValue)
    }, 1),
    []
  )

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
  }

  useEffect(() => {
    updateDefaultAccountData()
  }, [])

  /* 
    set file stuffs
  */
  useEffect(() => {
    setFile(!isEmpty(acceptedFiles) ? acceptedFiles[0] : {})
    // if (!isEmpty(acceptedFiles)) history.push('/create')
  }, [acceptedFiles])

  useEffect(() => {
    // load nfts and collection from store, set to state
    const loadAssetsFromStorage = async () => {
      setIsLoading((prev) => ++prev)
      let allCollections = await popupAccount.getAllCollections()
      let allCollectionNfts = await popupAccount.getAllCollectionNfts()
      dispatch(setCollections({ collections: allCollections, filteredCollections: allCollections }))
      dispatch(setCollectionNfts({ collectionNfts: allCollectionNfts }))

      console.log('all Collections', allCollections)
      console.log('loading all contents')
      let allAssets = await popupAccount.getAllAssets()
      let validAssets = allAssets.filter((asset) => asset.name !== '...')

      validAssets = classifyAssets(validAssets, allCollections)
      console.log('valid assets', validAssets.length)
      validAssets = validAssets.filter((nft) => !get(nft, 'name')?.includes('DID Profile Page'))

      dispatch(setAssets({ nfts: validAssets, filteredNfts: validAssets }))

      setIsLoading((prev) => --prev)
    }

    const fetchAssets = async () => {
      let allCollections = await popupAccount.getAllCollections()
      let allCollectionNfts = await popupAccount.getAllCollectionNfts()
      let allAssets, validAssets

      const loadCollection = async () => {
        console.log('LOADING COLLECTION')
        await backgroundRequest.gallery.loadCollections()
        allCollections = await popupAccount.getAllCollections()
        allCollectionNfts = await popupAccount.getAllCollectionNfts()
        dispatch(
          setCollections({ collections: allCollections, filteredCollections: allCollections })
        )
        dispatch(setCollectionNfts({ collectionNfts: allCollectionNfts }))
      }

      const loadNfts = async () => {
        await backgroundRequest.assets.loadAllContent()
        allAssets = await popupAccount.getAllAssets()
        validAssets = allAssets.filter((asset) => asset.name !== '...')
        validAssets = classifyAssets(validAssets, allCollections)
        validAssets = validAssets.filter((nft) => !get(nft, 'name')?.includes('DID Profile Page'))
        dispatch(setAssets({ nfts: validAssets, filteredNfts: validAssets }))
      }

      setIsLoading((prev) => ++prev)
      await Promise.all([loadCollection, loadNfts].map((f) => f()))
      validAssets = classifyAssets(validAssets, allCollections)
      if (isEmpty(validAssets) && pathname === '/') {
      } else {
        dispatch(setAssets({ nfts: validAssets, filteredNfts: validAssets }))
      }
      setIsLoading((prev) => --prev)
    }

    loadAssetsFromStorage()
    fetchAssets()
  }, [walletLoaded, newAddress])

  return (
    <GalleryContext.Provider
      value={{
        file,
        handleShareNFT,
        isDragging,
        onClearFile,
        onCloseUploadModal,
        searchTerm,
        setError,
        setFile,
        isLoading,
        setIsLoading,
        setNotification,
        setSearchTerm,
        setShowCreateCollection,
        showCreateCollection,
        importedAddress,
        setImportedAddress,
        setNewAddress,
        inputFileRef,
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
          {!isEmpty(accounts) ? (
            <>
              {!isLocked ? (
                <div
                  {...getRootProps({ className: 'app dropzone' })}
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
                  {isDragging && isEmpty(file) && <input name="fileField" {...getInputProps()} />}

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
