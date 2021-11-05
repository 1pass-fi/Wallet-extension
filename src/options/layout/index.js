import '@babel/polyfill'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory, useLocation, Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'

import isEmpty from 'lodash/isEmpty'
import throttle from 'lodash/throttle'
import get from 'lodash/get'
import find from 'lodash/find'

import { GALLERY_IMPORT_PATH, MESSAGES, FRIEND_REFERRAL_ENDPOINTS } from 'constants/koiConstants'

import { setAccounts } from 'options/actions/accounts'

import './index.css'
import StartUp from 'options/pages/StartUp'
import Footer from 'options/components/footer'
import Header from 'options/components/header'
import Navbar from 'options/components/navbar'
import Message from 'options/components/message'
import LockScreen from 'options/components/lockScreen'
import Uploaded from 'options/components/uploaded'

import { GalleryContext } from 'options/galleryContext'
import { TYPE } from 'constants/accountConstants'

import ShareNFT from 'options/modal/shareNFT'
import ExportNFT from 'options/modal/exportNFT'
import Welcome from 'options/modal/welcomeScreen'
import UploadingNFT from 'options/modal/UploadingNFT'
import SuccessUploadNFT from 'options/modal/SuccessUploadNFT'
import TransferNFT from 'options/modal/TransferNFT'
import KoiIcon from 'img/finnie-koi-logo-white.svg'

import storage from 'services/storage'
import { popupBackgroundRequest as backgroundRequest, popupBackgroundConnect } from 'services/request/popup'

import { popupAccount } from 'services/account'
import SelectAccountModal from 'options/modal/SelectAccountModal'

import { EventHandler } from 'services/request/src/backgroundConnect'
import Wallets from 'arweave/node/wallets'

export default ({ children }) => {
  const { pathname } = useLocation()
  const history = useHistory()

  const headerRef = useRef(null)
  const inputFileRef = useRef(null)

  const [walletLoaded, setWalletLoaded] = useState(false) // flag to do something after all accounts loaded
  const [isLocked, setIsLocked] = useState(false) // show "unlock finnie" on locked
  const [isLoading, setIsLoading] = useState(false) // loading state
  
  const [account, setAccount] = useState({}) // default account
  const [totalKoi, setTotalKoi] = useState(0) // Koii balance
  const [totalAr, setTotalAr] = useState(0) // Ar balance

  const [affiliateCode, setAffiliateCode] = useState(null) // friend code
  const [totalReward, setTotalReward] = useState(null) // total reward friend referral
  const [inviteSpent, setInviteSpent] = useState(false) // spent invitation ?

  const [showSelectAccount, setShowSelectAccount] = useState(false) // choose account on upload nft
  const [importedAddress, setImportedAddress] = useState(null) // just imported account
  const [newAddress, setNewAddress] = useState(null) // just imported address
  const [showWelcome, setShowWelcome] = useState(false) // show welcome modal

  const [isDragging, setIsDragging] = useState(false) // ???
  const [file, setFile] = useState({}) // file for create nft
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: ['image/*', 'video/*', 'audio/*'],
    noClick: true,
  })

  const [cardInfos, setCardInfos] = useState([]) // all NFTs data

  const [searchTerm, setSearchTerm] = useState('') // search bar
  const [error, setError] = useState(null) // error message
  const [notification, setNotification] = useState(null) // notification message

  const [stage, setStage] = useState(1) // for upload NFT flow (Header - Bottom)
  const [showViews, setShowViews] = useState(true) // show view on setting
  const [showEarnedKoi, setShowEarnedKoi] = useState(true) // show earned koii on setting

  const [pendingNFTTitle, setPendingNFTTitle] = useState('') // title of new NFT
  const [showUploadingModal, setShowUploadingModal] = useState(false) // show uploading modal on top
  const [showSuccessUploadModal, setShowSuccessUploadModal] = useState(false) // show success upload modal on top
  const [showUploadedIcon, setShowUploadedIcon] = useState(false) // show updated Icon on top
  const [showTransferNFT, setShowTransferNFT] = useState({ show: false }) // to show transfer modal

  const [showShareModal, setShowShareModal] = useState({
    show: false,
    txid: null,
  }) // show share modal for big NFT content
  const [showExportModal, setShowExportModal] = useState({}) // show bridge modal

  const [showCreateCollection, setShowCreateCollection] = useState(false) // show create collection on home page
  const [collectionNFT, setCollectionNFT] = useState([]) // selected nfts for creating new collection
  const [page, setPage] = useState(0) // for collection ?
  const [totalPage, setTotalPage] = useState(1) // total page of selected nfts collection form (5 nft / page)
  const [collectionsLoaded, setCollectionsLoaded] = useState(false) // flag for loading collection status
  const [collections, setCollections] = useState([]) // ???


  const accounts = useSelector(state => state.accounts)
  const dispatch = useDispatch()

  /* 
    STEP 1:
    - Load accounts from chrome storage
  */
  useEffect(() => {
    const loadWallets = async () => {
      await popupAccount.loadImported()

      const allAccounts  = await popupAccount.getAllMetadata()
      dispatch(setAccounts(allAccounts))

      const _isLocked = await backgroundRequest.wallet.getLockState()

      setWalletLoaded(true)
      // go to lock screen if having imported account 
      if(!isEmpty(allAccounts)){
        setIsLocked(_isLocked)
      }
    }

    setIsLoading(true)
    loadWallets()
  }, [])

  /*
    STEP 2: 
    - Load for activated (default) account.

    This account will be used to display balances, kID, connect site.
    On setting, user can change their activated (default) account.
  */
  useEffect(() => {
    const loadActivatedAccount = async () => {
      /* 
        Set activatedAccount to account 
      */
      try {
        let activatedAccount = await storage.setting.get.activatedAccountAddress()
        activatedAccount = await popupAccount.getAccount({
          address: activatedAccount,
        })
        activatedAccount = await activatedAccount.get.metadata()
        setAccount(activatedAccount)
      } catch (err) {
        console.log(err.message)
      }
    }

    const getCollectionsFromStorage = async () => {
      try {
        const allCollections = await popupAccount.getAllCollections()
        setCollections(allCollections)
      } catch (err) {
        setError(err.message)
      }
    }

    if (walletLoaded) {
      loadActivatedAccount()
      getCollectionsFromStorage()
    }

  }, [walletLoaded])

  /* 
   STEP 3: ( run on default account changed)
   - Load data for set default account
  */
  useEffect(() => {
    const getUserData = async () => {
      try {
        const activatedAccount = await popupAccount.getAccount({
          address: account.address,
        })

        // balances
        const arBalance = await activatedAccount.get.balance()
        const koiBalance = await activatedAccount.get.koiBalance()
        setTotalKoi(koiBalance)
        setTotalAr(arBalance)

        // get affiliate code from storage
        const affiliateCodeStorage = await storage.generic.get.affiliateCode()
        if (affiliateCodeStorage) setAffiliateCode(affiliateCodeStorage)

        /* 
          TODO: Will add affiliate functions to method of account classes.
        */
        if (!affiliateCodeStorage && account.type === TYPE.ARWEAVE) {
          const code = await backgroundRequest.gallery.friendReferral({
            endpoints: FRIEND_REFERRAL_ENDPOINTS.GET_AFFILIATE_CODE,
          })
          const reward = await backgroundRequest.gallery.friendReferral({
            endpoints: FRIEND_REFERRAL_ENDPOINTS.GET_TOTAL_REWARD
          })
          const spent = await backgroundRequest.gallery.friendReferral({
            endpoints: FRIEND_REFERRAL_ENDPOINTS.CHECK_AFFILIATE_INVITE_SPENT
          })
          setAffiliateCode(code)
          setTotalReward(reward)
          setInviteSpent(spent)
        }
      } catch (err) {
        console.log(err.message)
      }
    }

    if (!isEmpty(accounts) || !GALLERY_IMPORT_PATH.includes(pathname)) {
      console.log('Loading for user data...')
      getUserData()
    }
  }, [account])

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
    Load assets:
    - Load NFTs for a specified wallet or all wallets

    Run on wallets state changed
  */
  useEffect(() => {
    const loadAssets = async () => {
      try {
        /* 
          newAddress: not isEmpty -> load assets for wallet that just imported
          newAddress: isEmpty -> load assets of all wallets (when just opened the gallery page and having imported wallets)
        */
        if (newAddress) {
          console.log('loading content for', newAddress)
          await backgroundRequest.assets.loadContent({ address: newAddress })
        } else {
          console.log('loading all contents')
          await backgroundRequest.assets.loadAllContent()
        }

        const allAssets = await popupAccount.getAllAssets()
        const validAssets = allAssets.filter(asset => asset.name !== '...')
        setCardInfos(validAssets)
        if (isEmpty(allAssets) && pathname === '/') history.push('/create')
        setIsLoading(false)
      } catch (err) {
        console.log(err.message)
        setIsLoading(false)
        setError(err.message)
      }
    }

    if (!isEmpty(accounts) && !GALLERY_IMPORT_PATH.includes(pathname)) {
      loadAssets()
    }
  }, [accounts])

  /* 
    Reload wallets when a new wallet just imported
  */
  useEffect(() => {
    const reloadWallets = async () => {
      await popupAccount.loadImported()

      if (get(popupAccount, 'importedAccount.length') === 1) {
        let activatedAccount = await storage.setting.get.activatedAccountAddress()
        activatedAccount = await popupAccount.getAccount({
          address: activatedAccount,
        })
        activatedAccount = await activatedAccount.get.metadata()
        setAccount(activatedAccount)
      }
    }

    if (newAddress) {
      reloadWallets() 
    }
  }, [newAddress])

  /* 
    Pre-load assets when import/upload/create new wallet
  */
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        console.log('pre-load content for imported address', importedAddress)
        await backgroundRequest.assets.loadContent({ address: importedAddress })
      } catch (err) {
        console.log(err.message)
      }
    }

    if (importedAddress) {
      preloadAssets()
    }
  }, [importedAddress])

  /* 
    On open create collection form, allAssets list should be set to assets of the 
    activated account.
    This action happens for the purpose of to prevent user from creating collection that contains
    an NFTs from another account - in case they imported more than one account.
  */
  useEffect(() => {
    const setAssetsForCreateCollection = async () => {
      if (showCreateCollection) {
        const _account = await popupAccount.getAccount({
          address: account.address,
        })
        let assets = await _account.get.assets()
        assets = assets.filter(asset => asset.name !== '...')
        setCardInfos(assets)
      }
    }

    if (!GALLERY_IMPORT_PATH.includes(pathname) && !isEmpty(account)) setAssetsForCreateCollection()
  }, [showCreateCollection, account])


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


  /* 
    Add backgroundConnect eventHandler
  */
  useEffect(() => {
    const handleAddHandler = () => {
      const loadBalancesSuccess = new EventHandler(
        MESSAGES.GET_BALANCES_SUCCESS,
        async () => {
          try {
            let activatedAccount = await storage.setting.get.activatedAccountAddress()
            activatedAccount = await popupAccount.getAccount({
              address: activatedAccount,
            })
            const activatedAccountData = await activatedAccount.get.metadata()
  
            const { balance: _balance, koiBalance } = activatedAccountData
            let balancesUpdated = false

            setTotalKoi(prev => {
              if (prev !== koiBalance) balancesUpdated = true
              return koiBalance
            })
            setTotalAr(prev => {
              if (prev !== _balance) balancesUpdated = true
              return _balance
            })

            if (balancesUpdated) setNotification('Your balances have been updated.')
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
          try {
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
            setCardInfos(prevState => {
              pendingAssets = pendingAssets.filter((nft) => {
                return prevState.every((prevNft) => nft.txId !== prevNft.txId)
              })
              return [...prevState, ...pendingAssets]
            })

            setIsLoading(false)
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
    const toShareNFT = find(cardInfos, { txId })
    setShowTransferNFT({show: true, cardInfo: toShareNFT})
  }

  // retry-upload
  const retryExportNFT = async (txId) => {
    const nftInfo = find(cardInfos, { txId })
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
    
    const result = await backgroundRequest.gallery.uploadNFT({ content, tags, fileType, address: account.address, price, isNSFW })
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

  return (
    <GalleryContext.Provider
      value={{
        account,
        affiliateCode,
        cardInfos,
        collectionNFT,
        collections,
        collectionsLoaded,
        file,
        handleShareNFT,
        retryExportNFT,
        inviteSpent,
        isDragging,
        onClearFile,
        onCloseUploadModal,
        page,
        pendingNFTTitle,
        searchTerm,
        setAccount,
        setCardInfos,
        setCollectionNFT,
        setCollections,
        setCollectionsLoaded,
        setError: _setError,
        setFile,
        setIsLoading,
        setNotification,
        setPage,
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
        setStage,
        setTotalPage,
        showCreateCollection,
        showTransferNFT,
        showEarnedKoi,
        showViews,
        stage,
        totalAr,
        totalKoi,
        totalPage,
        totalReward,
        importedAddress,
        setImportedAddress,
        setNewAddress,
        inputFileRef,
        walletLoaded
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

              {showUploadingModal && <UploadingNFT />}
              {showSuccessUploadModal && <SuccessUploadNFT />}
              {showUploadedIcon && <Uploaded />}

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

              <Link to="/">
                <div className="startup-logo"><KoiIcon /></div>
              </Link>
              {!GALLERY_IMPORT_PATH.includes(pathname) && <Header
                totalKoi={totalKoi}
                totalAr={totalAr}
                headerRef={headerRef}
                isLoading={isLoading}
              />}
              <input onChange={(e) => handleSetFile(e)} onClick={(e) => e.target.value = null} type='file' ref={inputFileRef} style={{ display: 'none' }} />
              {children}
              {!GALLERY_IMPORT_PATH.includes(pathname) && <Footer onClearFile={onClearFile} inputFileRef={inputFileRef} showDropzone={showDropzone} />}
              {!GALLERY_IMPORT_PATH.includes(pathname) && <Navbar />}
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
