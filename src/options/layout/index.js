import '@babel/polyfill'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash/isEmpty'
import throttle from 'lodash/throttle'
import get from 'lodash/get'
import find from 'lodash/find'

import { GALLERY_IMPORT_PATH, MESSAGES, FRIEND_REFERRAL_ENDPOINTS } from 'constants/koiConstants'

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

import storage from 'services/storage'
import { popupBackgroundRequest as backgroundRequest, popupBackgroundConnect } from 'services/request/popup'

import { popupAccount } from 'services/account'
import SelectAccountModal from 'options/modal/SelectAccountModal'

import { EventHandler } from 'services/request/src/backgroundConnect'

export default ({ children }) => {
  const { pathname } = useLocation()
  const history = useHistory()

  const headerRef = useRef(null)
  const inputFileRef = useRef(null)

  const [wallets, setWallets] = useState([])
  const [arWallets, setArWallets] = useState([])
  const [account, setAccount] = useState({})
  const [isDragging, setIsDragging] = useState(false)
  const [cardInfos, setCardInfos] = useState([])
  const [totalKoi, setTotalKoi] = useState(0)
  const [totalAr, setTotalAr] = useState(0)
  const [file, setFile] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [affiliateCode, setAffiliateCode] = useState(null)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const [totalReward, setTotalReward] = useState(null)
  const [inviteSpent, setInviteSpent] = useState(false)
  const [showCreateCollection, setShowCreateCollection] = useState(false)
  const [collectionNFT, setCollectionNFT] = useState([])
  const [totalPage, setTotalPage] = useState(1)
  const [stage, setStage] = useState(1)
  const [page, setPage] = useState(0)
  const [showViews, setShowViews] = useState(true)
  const [showEarnedKoi, setShowEarnedKoi] = useState(true)
  const [accountName, setAccountName] = useState('')
  const [collectionsLoaded, setCollectionsLoaded] = useState(false)
  const [isWaitingAddNFT, setIsWaitingAddNFT] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  const [showUploadingModal, setShowUploadingModal] = useState(false)
  const [showSuccessUploadModal, setShowSuccessUploadModal] = useState(false)
  const [showUploadedIcon, setShowUploadedIcon] = useState(false)
  const [showTransferNFT, setShowTransferNFT] = useState({ show: false })

  const [demoCollections, setDemoCollections] = useState([])
  const [collections, setCollections] = useState([])
  const [showShareModal, setShowShareModal] = useState({
    show: false,
    txid: null,
  })
  const [pendingNFTTitle, setPendingNFTTitle] = useState('')
  const [showExportModal, setShowExportModal] = useState({})
  const [showWelcome, setShowWelcome] = useState(false)
  const [showSelectAccount, setShowSelectAccount] = useState(false)
  const [walletLoaded, setWalletLoaded] = useState(false)

  const [importedAddress, setImportedAddress] = useState(null)
  const [newAddress, setNewAddress] = useState(null)



  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: ['image/*', 'video/*', 'audio/*'],
    noClick: true,
  })

  /* 
    STEP 1:
    - Load accounts from chrome storage
    - Passing file to dependency array to support create new NFT in case import new wallet
  */
  useEffect(() => {
    const loadWallets = async () => {
      await popupAccount.loadImported()

      const allAccounts  = await popupAccount.getAllMetadata()
      setWallets(allAccounts)

      const arAccounts = await popupAccount.getAllMetadata(TYPE.ARWEAVE)
      setArWallets(arAccounts)

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

    if (walletLoaded) loadActivatedAccount()
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

        // not sure if we still need this state
        setAddress(account.address)

        // balances
        const arBalance = await activatedAccount.get.balance()
        const koiBalance = await activatedAccount.get.koiBalance()
        setTotalKoi(koiBalance)
        setTotalAr(arBalance)

        // set account name
        const accountName = await activatedAccount.get.accountName()
        setAccountName(accountName)

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
        console.log('ERRORRRRR')
        console.log(err.message)
      }
    }

    if (!isEmpty(wallets) || !GALLERY_IMPORT_PATH.includes(pathname)) {
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

      if (showViewStorage) setShowViews(showViewStorage)
      if (showEarnedKoiStorage) setShowEarnedKoi(showEarnedKoiStorage)

      if (!showWelcomeScreen) {
        setShowWelcome(true)
        await storage.setting.set.showWelcomeScreen(1)
      }
    }

    if (!isEmpty(wallets) || !GALLERY_IMPORT_PATH.includes(pathname)) {
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
        if (isEmpty(allAssets)) history.push('/create')
        setIsLoading(false)
      } catch (err) {
        console.log(err.message)
        setIsLoading(false)
        setError(err.message)
      }
    }

    if (!isEmpty(wallets) && !GALLERY_IMPORT_PATH.includes(pathname)) {
      loadAssets()
    }
  }, [wallets])

  /* 
    Reload wallets when a new wallet just imported
  */
  useEffect(() => {
    const reloadWallets = async () => {
      await popupAccount.loadImported()
      const allData = await popupAccount.getAllMetadata()
      setWallets(allData)

      const arAccounts = await popupAccount.getAllMetadata(TYPE.ARWEAVE)
      setArWallets(arAccounts)
    }

    if (newAddress) reloadWallets()
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
            const pendingAssets = await activatedAccount.get.pendingAssets() || []
            setCardInfos(prevState => {
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
    
      popupBackgroundConnect.addHandler(uploadNFTHandler)
      popupBackgroundConnect.addHandler(loadBalancesSuccess)
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

  return (
    <GalleryContext.Provider
      value={{
        account,
        accountName,
        address,
        affiliateCode,
        cardInfos,
        collectionNFT,
        collections,
        collectionsLoaded,
        demoCollections,
        file,
        handleShareNFT,
        inviteSpent,
        isDragging,
        isWaitingAddNFT,
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
        setDemoCollections,
        setError: _setError,
        setFile,
        setIsLoading,
        setIsWaitingAddNFT,
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
        wallets,
        importedAddress,
        setImportedAddress,
        setNewAddress,
        arWallets,
        inputFileRef
      }}
    >
      <div className='app-background'>
        {!isEmpty(wallets) ?
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
              {notification && <Message children={notification} type='notification' />}
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

              {!GALLERY_IMPORT_PATH.includes(pathname) && <Header
                totalKoi={totalKoi}
                totalAr={totalAr}
                headerRef={headerRef}
                isLoading={isLoading}
                isWaitingAddNFT={isWaitingAddNFT}
                setIsWaitingAddNFT={setIsWaitingAddNFT}
              />}
              <input onChange={(e) => handleSetFile(e)} type='file' ref={inputFileRef} style={{ display: 'none' }} />
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
                {notification && <Message children={notification} type='notification' />}
                <StartUp />
              </div>}
          </>
        }
      </div>
    </GalleryContext.Provider>
  )
}
