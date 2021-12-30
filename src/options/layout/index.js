import '@babel/polyfill'
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useHistory, useLocation, Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector, useStore } from 'react-redux'

import isEmpty from 'lodash/isEmpty'
import throttle from 'lodash/throttle'
import get from 'lodash/get'
import find from 'lodash/find'
import includes from 'lodash/includes'

import { GALLERY_IMPORT_PATH, MESSAGES, FRIEND_REFERRAL_ENDPOINTS } from 'constants/koiConstants'

import './index.css'
import StartUp from 'options/pages/StartUp'
import Message from 'options/components/message'
import LockScreen from 'options/components/lockScreen'

import { GalleryContext } from 'options/galleryContext'

import ShareNFT from 'options/modal/shareNFT'
import ExportNFT from 'options/modal/exportNFT'
import Welcome from 'options/modal/welcomeScreen'
import TransferNFT from 'options/modal/TransferNFT'

import storage from 'services/storage'
import { popupBackgroundRequest as backgroundRequest, popupBackgroundConnect } from 'services/request/popup'

import { popupAccount } from 'services/account'
import SelectAccountModal from 'options/modal/SelectAccountModal'

import { EventHandler } from 'services/request/src/backgroundConnect'

import { loadAllAccounts, loadAllFriendReferralData } from 'options/actions/accounts'
import { setDefaultAccount } from 'options/actions/defaultAccount'
import { setCollections } from 'options/actions/collections'
import { setAssets, setCollectionNfts } from 'options/actions/assets'

export default ({ children }) => {
  const { pathname } = useLocation()
  const history = useHistory()

  const headerRef = useRef(null)
  const inputFileRef = useRef(null)

  /* 
    Local state
  */
  const [walletLoaded, setWalletLoaded] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  /* 
    Create collection states
  */
  const [showCreateCollection, setShowCreateCollection] = useState(false) // show create collection on home page

  /* 
    Settings state
  */
  const [showViews, setShowViews] = useState(true) // show view on setting
  const [showEarnedKoi, setShowEarnedKoi] = useState(true) // show earned koii on setting
  const [showWelcome, setShowWelcome] = useState(false) // show welcome modal


  /* 
    Modal state
  */
  const [pendingNFTTitle, setPendingNFTTitle] = useState('') // title of new NFT to show on modal
  const [showUploadingModal, setShowUploadingModal] = useState(false) // show uploading modal on top
  const [showSuccessUploadModal, setShowSuccessUploadModal] = useState(false) // show success upload modal on top
  const [showUploadedIcon, setShowUploadedIcon] = useState(false) // show updated Icon on top
  const [showTransferNFT, setShowTransferNFT] = useState({ show: false }) // to show transfer modal
  const [showShareModal, setShowShareModal] = useState({
    show: false,
    txid: null,
  }) // show share modal for big NFT content
  const [showExportModal, setShowExportModal] = useState({}) // show bridge modal
  const [showSelectAccount, setShowSelectAccount] = useState(false) // choose account on upload nft
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false)


  /* 
    Notification state
  */
  const [isLoading, setIsLoading] = useState(0) // loading state
  const [error, setError] = useState(null) // error message
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
    noClick: true,
  })

  /* 
    DID state
  */
  const kidLinkPrefix = 'https://koii.id/'
  const [userKID, setuserKID] = useState({
    kidLink: kidLinkPrefix,
    name: '',
    country: '',
    pronouns: '',
    description: '',
  })
  const [kID, setkID] = useState('')
  const [hadData, setHadData] = useState(false)
  const [didID, setDidID] = useState(null) // use for updateDID
  const [profilePictureId, setProfilePictureId] = useState(null)
  const [bannerId, setBannerId] = useState(null)
  const [linkAccounts, setLinkAccounts] = useState([{ title: '', link: '' }])
  const [customCss, setCustomCss] = useState('')
  const [usingCustomCss, setUsingCustomCss] = useState(false)
  const [expandedCssEditor, setExpandedCssEditor] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [oldkID, setOldkID] = useState('')


  const [searchTerm, setSearchTerm] = useState('') // search bar

  const dispatch = useDispatch()

  /* 
    GET STATE FROM STORE
  */
  const accounts = useSelector(state => state.accounts)
  const defaultAccount = useSelector(state => state.defaultAccount)
  const assets = useSelector(state => state.assets)

  /* 
    STEP 1:
    - Load accounts from chrome storage
  */
  useEffect(() => {
    const loadWallets = async () => {
      setIsLoading(prev => ++prev)
      const allAccounts = await dispatch(loadAllAccounts()) // will load default account also
      const _isLocked = await backgroundRequest.wallet.getLockState()

      setWalletLoaded(true)
      // go to lock screen if having imported account 
      if(!isEmpty(allAccounts)){
        setIsLocked(_isLocked)
      }
      setIsLoading(prev => --prev)
    }
    loadWallets()
  }, [])

  /*
    STEP 2: 
  */
  const getDID = async () => {
    try {
      setIsLoading(prev => ++prev)
      const defaultAccountAddress = await storage.setting.get.activatedAccountAddress()
      let state, id
      try {
        const result = await backgroundRequest.gallery.getDID({ address: defaultAccountAddress })
        state = result.state

        if (!isEmpty(state)) {
          setHadData(true)
        } else {
          setHadData(false)
        }

        id = result.id
      } catch (err) {
        console.log(err.message)
        setHadData(false)
        state = {
          links: [{ title: '', link: '' }],
          name: '',
          description: '',
          country: '',
          pronouns: '',
          kID: '',
          code: '',
          styles: []
        }
      }

      const _userKID = {
        kidLink: state.kID ? `https://koii.me/u/${state.kID}` : 'https://koii.me/u/',
        name: state.name,
        description: state.description,
        country: state.country,
        pronouns: state.pronouns
      }

      setDidID(id)
      setuserKID(prev => ({...prev, ..._userKID}))
  
      setProfilePictureId(state.picture)
      setBannerId(state.banner)
      setCustomCss(state.code)
      setUsingCustomCss(!isEmpty(state.code))
  
      setLinkAccounts(state.links)
      setkID(state.kID)
      setOldkID(state.kID)
      setIsLoading(prev => --prev)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    const loadCollections = async () => {
      try {
        /* Load collections from storage */
        setIsLoading(prev => ++prev)
        let allCollections = await popupAccount.getAllCollections()
        let allCollectionNfts = await popupAccount.getAllCollectionNfts()
        dispatch(setCollections({ collections: allCollections, filteredCollections: allCollections }))
        dispatch(setCollectionNfts({ collectionNfts: allCollectionNfts }))

        await backgroundRequest.gallery.loadCollections()

        /* Fetch for collections */
        allCollections = await popupAccount.getAllCollections()
        allCollectionNfts = await popupAccount.getAllCollectionNfts()
        dispatch(setCollections({ collections: allCollections, filteredCollections: allCollections }))
        dispatch(setCollectionNfts({ collectionNfts: allCollectionNfts }))
        setIsLoading(prev => --prev)
      } catch (err) {
        setIsLoading(prev => --prev)
        setError(err.message)
      }
    }

    const getAffiliateCode = () => {
      dispatch(loadAllFriendReferralData())
    }

    if (walletLoaded) {
      loadCollections()
      getAffiliateCode()
      getDID()
    }

  }, [walletLoaded])

  /* 
   STEP 3: ( run on default account changed)
   - Load data for set default account
  */


  /* 
    Load gallery settings
    - Options: showViews, showEarnedKoi
    - Flag: showWelcomeScreen - true for the first time opened, then false.
  */
  useEffect(() => {
    const loadGallerySettings = async () => {
      const showViewStorage = await storage.setting.get.showViews()
      const showEarnedKoiStorage = await storage.setting.get.showEarnedKoi()
      const showWelcomeScreen = await storage.setting.get.showWelcomeScreen()

      if (showViewStorage !== null) setShowViews(showViewStorage)
      if (showEarnedKoiStorage !== null) setShowEarnedKoi(showEarnedKoiStorage)

      if (!showWelcomeScreen) {
        setShowWelcome(true)
        await storage.setting.set.showWelcomeScreen(1)
      }
    }

    if (!isEmpty(accounts) || !GALLERY_IMPORT_PATH.includes(pathname)) {
      loadGallerySettings()
    }
  }, [walletLoaded])

  /* 
    Load all NFTs
  */
  useEffect(() => {
    const loadAllContents = async () => {
      setIsLoading(prev => ++prev)
      console.log('loading all contents')
      let allAssets = await popupAccount.getAllAssets()
      let validAssets = allAssets.filter(asset => asset.name !== '...' && !includes(asset.name, 'DID Profile Page'))
      dispatch(setAssets({ nfts: validAssets }))

      await backgroundRequest.assets.loadAllContent()
      allAssets = await popupAccount.getAllAssets()
      validAssets = allAssets.filter(asset => asset.name !== '...' && !includes(asset.name, 'DID Profile Page'))
      dispatch(setAssets({ nfts: validAssets }))
      if (isEmpty(allAssets) && pathname === '/') history.push('/create')
      setIsLoading(prev => --prev)
    }

    if (walletLoaded) loadAllContents()
  }, [walletLoaded])

  useEffect(() => {
    if (defaultAccount) getDID()
  }, [defaultAccount])

  /* 
    Load assets:
    - Load NFTs for a specified wallet or all wallets

    Run on wallets state changed
  */
  useEffect(() => {
    const loadAssetsForNewAddress = async () => {
      try {
        if (newAddress) {
          setIsLoading(prev => ++prev)
          console.log('loading content for', newAddress)
          await backgroundRequest.assets.loadContent({ address: newAddress })

          const allAssets = await popupAccount.getAllAssets()
          const validAssets = allAssets.filter(asset => asset.name !== '...' && !includes(asset.name, 'DID Profile Page'))
          dispatch(setAssets({ nfts: validAssets }))
          if (isEmpty(allAssets) && pathname === '/') history.push('/create')
          setIsLoading(prev => --prev)
        }
      } catch (err) {
        console.log(err.message)
        setIsLoading(prev => --prev)
        setError(err.message)
      }
    }

    loadAssetsForNewAddress()
  }, [newAddress])

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
        let activatedAccount = await storage.setting.get.activatedAccountAddress()
        activatedAccount = await popupAccount.getAccount({
          address: activatedAccount,
        })
        activatedAccount = await activatedAccount.get.metadata()
        dispatch(setDefaultAccount(activatedAccount))
      }
    }

    if (newAddress) {
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
        address: defaultAccount.address,
      })
      let assets = await _account.get.assets()
      assets = assets.filter(asset => asset.name !== '...')
      dispatch(setAssets({ nfts: assets }))
    }

    if (showCreateCollection) setAssetsForCreateCollection()
  }, [showCreateCollection, defaultAccount])


  /*
    Redirect to create NFT page to support create new NFT in case import new wallet
  */
  useEffect(() => {
    if (!isEmpty(file)) history.push('/create')
  }, [file])

  /* 
    set error with null then with a message to make sure it will be re-rendered on setError
  */
  const _setError = (message) => {
    setError(null)
    setError(message)
  }
  
  /* 
    set state timer
  */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  useEffect(() => {
    if (showUploadedIcon) {
      const timer = setTimeout(() => setShowUploadedIcon(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [showUploadedIcon])

  useEffect(() => {
    if (showSuccessUploadModal) {
      const timer = setTimeout(() => setShowSuccessUploadModal(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessUploadModal])


  /* 
    set file stuffs
  */
  useEffect(() => {
    setFile(!isEmpty(acceptedFiles) ? acceptedFiles[0] : {})
    if (!isEmpty(acceptedFiles)) history.push('/create')
  }, [acceptedFiles])

  const onClearFile = () => {
    setFile({})
    inputFileRef.current.value = null
  }

  const onCloseUploadModal = () => {
    setFile({})
    setIsDragging(false)
  }

  /* 
    PLEASE FIND OUT WHAT IT DOES AND LEAVE A COMMENT HERE
  */
  const modifyDraging = useCallback(
    throttle((newValue) => {
      setIsDragging(newValue)
    }, 1),
    []
  )
  const showDropzone = () => {
    modifyDraging(true)
  }

  const store = useStore()
  /* 
    Add backgroundConnect eventHandler
  */
  useEffect(() => {
    const handleAddHandler = () => {
      const loadBalancesSuccess = new EventHandler(
        MESSAGES.GET_BALANCES_SUCCESS,
        async () => {
          try {
            const { defaultAccount } = store.getState()

            let activatedAccount = await storage.setting.get.activatedAccountAddress()
            activatedAccount = await popupAccount.getAccount({
              address: activatedAccount,
            })
            const activatedAccountData = await activatedAccount.get.metadata()
            const { balance, koiBalance } = activatedAccountData

            const balancesUpdated = defaultAccount.balance !== balance || defaultAccount.koiBalance !== koiBalance
            if (balancesUpdated) {
              await dispatch(loadAllAccounts())

              setNotification('Your balances have been updated.')
            }

            console.log('defaultAccount', defaultAccount)
          } catch (err) {
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
            let activatedAccount = await storage.setting.get.activatedAccountAddress()
            activatedAccount = await popupAccount.getAccount({
              address: activatedAccount,
            })
            let pendingAssets = await activatedAccount.get.pendingAssets() || []

            pendingAssets = pendingAssets.filter(nft => {
              return assets.nfts.every(prevNft => nft.txId !== prevNft.txId)
            })

            dispatch(setAssets({ nfts: [...assets.nfts, ...pendingAssets] }))

            setIsLoading(prev => --prev)
            setShowUploadingModal(false)
            setShowUploadedIcon(true)
            setShowSuccessUploadModal(true)
          } catch (err) {
            console.log('error: ', err)
          }
        }
      )
    
      popupBackgroundConnect.addHandler(loadBalancesSuccess)
      popupBackgroundConnect.addHandler(reloadGalleryHandler)
      popupBackgroundConnect.addHandler(uploadNFTHandler)
    }
  
    handleAddHandler()
  }, [])

  const handleSetFile = (e) => {
    const file = get(e, 'target.files')[0]
    if (file) {
      if (get(file, 'type').includes('image') || get(file, 'type').includes('video')) setFile(file)
    }
  }

  // NFT sharing
  const handleShareNFT = (txId) => {
    const toShareNFT = find(assets.nfts, { txId })
    setShowTransferNFT({show: true, cardInfo: toShareNFT})
  }

  // retry-upload
  const retryExportNFT = async (txId) => {
    const nftInfo = find(assets.nfts, { txId })
    console.log('NFT info', nftInfo)

    const metadata = {
      title: nftInfo.name,
      username: nftInfo.owner,
      description: nftInfo.description,
      tags: nftInfo.tags,
      isNSFW: nftInfo.isNSFW
    }

    const imgBase64 = nftInfo.imageUrl.slice(nftInfo.imageUrl.indexOf(',') + 1)
    const imgUpload = _base64ToArrayBuffer(imgBase64)


    // create blob from u8
    const blob = new Blob([imgUpload], { type: 'contentType'})

    // create file from blob
    const bitObject = new File([blob], nftInfo.name, { type: nftInfo.contentType })
    const file = {
      type: nftInfo.contentType,
      name: nftInfo.name,
      u8: bitObject 
    }

    console.log('retry export NFT...')

    const content = {
      title,
      owner: username,
      description,
      isNSFW
    }
    const tags = nftInfo.tags
    const fileType = nftInfo.contentType
    
    const result = await backgroundRequest.gallery.uploadNFT({ content, tags, fileType, address: defaultAccount.address, price, isNSFW })
    console.log('retry export NFT - DONE', result)
  }

  const _base64ToArrayBuffer = (base64) => {
    const binary_string = window.atob(base64)
    const len = binary_string.length
    const bytes = new Uint8Array(len)
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i)
    }
    return bytes.buffer
  }

  const getDID = async () => {
    try {
      setIsLoading(prev => ++prev)
      const defaultAccountAddress = await storage.setting.get.activatedAccountAddress()
      let state, id
      try {
        const result = await backgroundRequest.gallery.getDID({ address: defaultAccountAddress })
        state = result.state

        if (!isEmpty(state)) {
          setHadData(true)
        } else {
          setHadData(false)
        }

        id = result.id
      } catch (err) {
        console.log(err.message)
        setHadData(false)
        state = {
          links: [{ title: '', link: '' }],
          name: '',
          description: '',
          country: '',
          pronouns: '',
          kID: '',
          code: '',
          styles: []
        }
      }

      const _userKID = {
        kidLink: state.kID ? `https://koii.id/${state.kID}` : 'https://koii.id/',
        name: state.name,
        description: state.description,
        country: state.country,
        pronouns: state.pronouns
      }

      console.log('userKID', _userKID)

      setDidID(id)
      setuserKID(prev => ({...prev, ..._userKID}))

      setProfilePictureId(state.picture)
      setBannerId(state.banner)
      setCustomCss(state.code)
      setUsingCustomCss(!isEmpty(state.code))

      setLinkAccounts(state.links)
      setkID(state.kID)
      setOldkID(state.kID)
      setIsLoading(prev => --prev)
    } catch (err) {
      console.error(err.message)
      setError('Get DID error')
      setIsLoading(prev => --prev)
    }
  }

  return (
    <GalleryContext.Provider
      value={{
        file,
        handleShareNFT,
        retryExportNFT,
        isDragging,
        onClearFile,
        onCloseUploadModal,
        pendingNFTTitle,
        searchTerm,
        setError: _setError,
        setFile,
        isLoading,
        setIsLoading,
        setNotification,
        setPendingNFTTitle,
        setSearchTerm,
        setShowCreateCollection,
        setShowEarnedKoi,
        setShowExportModal,
        setShowSelectAccount,
        setShowShareModal,
        setShowUploadingModal,
        setShowViews,
        setShowWelcome,
        showCreateCollection,
        showTransferNFT,
        showEarnedKoi,
        showViews,
        importedAddress,
        setImportedAddress,
        setNewAddress,
        inputFileRef,
        walletLoaded,
        userKID, setuserKID,
        hadData, setHadData,
        didID, setDidID,
        profilePictureId, setProfilePictureId,
        bannerId, setBannerId,
        linkAccounts, setLinkAccounts,
        customCss, setCustomCss,
        usingCustomCss, setUsingCustomCss,
        expandedCssEditor, setExpandedCssEditor,
        showModal, setShowModal,
        modalType, setModalType,
        kID, setkID,
        oldkID, setOldkID,
        getDID
      }}
    >
      <div className='app-background'>
        {!isEmpty(accounts) ?
          <>
            {!isLocked ? <div
              {...getRootProps({ className: 'app dropzone' })}
              onDragOver={() => modifyDraging(true)}
              onDragLeave={() => modifyDraging(false)}
              onClick={(e) => {
                if (e.target.className === 'modal-container') {
                  setShowShareModal(false)
                  setShowExportModal(false)
                  setShowWelcome(false)
                }
              }}
            >
              {error && <Message children={error} />}
              {notification && !GALLERY_IMPORT_PATH.includes(pathname) && <Message children={notification} type='notification' />}
              {showShareModal.show && (
                <ShareNFT
                  txid={showShareModal.txid}
                  onClose={() => {
                    setShowShareModal({ ...showShareModal, show: false })
                  }}
                />
              )}
              {!isEmpty(showExportModal) && (
                <ExportNFT
                  info={showExportModal}
                  onClose={() => {
                    setShowExportModal(false)
                  }}
                />
              )}

              {showTransferNFT.show && (
                <TransferNFT
                  cardInfo={showTransferNFT.cardInfo}
                  onClose={() => {
                    setShowTransferNFT({ show: false })
                  }}
                />
              )}

              {showWelcome && (
                <Welcome
                  onClose={() => {
                    setShowWelcome(false)
                  }}
                />
              )
              }
              {showSelectAccount && (
                <SelectAccountModal
                  onClose={() => {
                    setShowSelectAccount(false)
                  }}
                />
              )
              }
              {isDragging && isEmpty(file) && (
                <input name='fileField' {...getInputProps()} />
              )}

              {children}
            </div> : <LockScreen />}
          </>
          :
          <>
            {walletLoaded &&
              <div>
                {error && <Message children={error} />}
                <StartUp />
              </div>}
          </>
        }
      </div>
    </GalleryContext.Provider>
  )
}
