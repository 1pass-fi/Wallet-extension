import '@babel/polyfill'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash/isEmpty'
import throttle from 'lodash/throttle'

import {
  getAffiliateCode,
  getTotalRewardKoi,
  checkAffiliateInviteSpent,
} from 'utils'
import { GALLERY_IMPORT_PATH, MESSAGES, FRIEND_REFERRAL_ENDPOINTS } from 'constants/koiConstants'

import './index.css'
import StartUp from 'options/pages/StartUp'
import Footer from 'options/components/footer'
import Header from 'options/components/header'
import Navbar from 'options/components/navbar'
import Message from 'options/components/message'

import { GalleryContext } from 'options/galleryContext'
import { TYPE } from 'constants/accountConstants'

import ShareNFT from 'options/modal/shareNFT'
import ExportNFT from 'options/modal/exportNFT'
import Welcome from 'options/modal/welcomeScreen'

import { Web } from '@_koi/sdk/web'
export const koi = new Web()

import storage from 'services/storage'
import { popupBackgroundRequest as backgroundRequest, popupBackgroundConnect } from 'services/request/popup'

import { popupAccount } from 'services/account'
import SelectAccountModal from 'options/modal/SelectAccountModal'
import SuccessUploadNFT from 'options/modal/SuccessUploadModal'

import { EventHandler } from 'services/request/src/backgroundConnect'

export default ({ children }) => {
  const { pathname } = useLocation()

  const history = useHistory()
  const [wallets, setWallets] = useState([])
  const [account, setAccount] = useState({})
  const [isDragging, setIsDragging] = useState(false)
  const [cardInfos, setCardInfos] = useState([])
  const [totalKoi, setTotalKoi] = useState(0)
  const [totalAr, setTotalAr] = useState(0)
  const [file, setFile] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState(null)
  const [wallet, setWallet] = useState(null)
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
  const [needUpdateWallet, setNeedUpdateWallet] = useState(true)

  const [demoCollections, setDemoCollections] = useState([])
  const [collections, setCollections] = useState([])
  const [showShareModal, setShowShareModal] = useState({
    show: false,
    txid: null,
  })
  const [showExportModal, setShowExportModal] = useState({})
  const [showWelcome, setShowWelcome] = useState(false)
  const [showSelectAccount, setShowSelectAccount] = useState(false)
  const [showSuccessUploadNFT, setShowSuccessUploadNFT] = useState(false)
  const [walletLoaded, setWalletLoaded] = useState(false)

  const [importedAddress, setImportedAddress] = useState(null)

  const headerRef = useRef(null)

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: ['image/*', 'video/*', 'audio/*'],
    noClick: true,
  })

  /* 
    Add event handler for Get balances
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
            if (koiBalance) setTotalKoi(koiBalance)
            setTotalAr(_balance)

            setNotification('Your balances have been updated.')
          } catch (err) {
            setError(err.message)
          }
        }
      )

      popupBackgroundConnect.addHandler(loadBalancesSuccess)
    }

    handleAddHandler()
  })

  /* 
    Load accounts from chrome storage
    Passing file to dependency array to support create new NFT in case import new wallet
  */
  useEffect(() => {
    const loadWallets = async () => {
      await popupAccount.loadImported()
      const allData = await popupAccount.getAllMetadata()
      console.log('allData', allData)

      const _isLocked = await backgroundRequest.wallet.getLockState()

      // All Account: [{ account1, account2 }]
      setWallets(allData)
      setIsLocked(_isLocked)
      setWalletLoaded(true)
    }

    setIsLoading(true)
    loadWallets()
  }, [file])

  /* 
    Load for activated (default) account.
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
  }, [walletLoaded, file])

  /* 
    Loads required data for gallery.
    Runs when account state changed.
  */
  useEffect(() => {
    /* 
      Meta data
      - Balances
      - Account Name
      - Friend affiliate data
    */
    const getUserData = async () => {
      try {
        const activatedAccount = await popupAccount.getAccount({
          address: account.address,
        })
        setAddress(account.address)

        // balances
        const arBalance = await activatedAccount.get.balance()
        const koiBalance = await activatedAccount.get.koiBalance()
        // console.log('arBalance', arBalance)
        // console.log('koiBalance', koiBalance)
        setTotalKoi(koiBalance)
        setTotalAr(arBalance)

        // set account name
        const accountName = await activatedAccount.get.accountName()
        setAccountName(accountName)

        const affiliateCodeStorage = await storage.generic.get.affiliateCode()
        if (affiliateCodeStorage) setAffiliateCode(affiliateCodeStorage)

        /* 
          TODO: we should remove this getting key request
          All actions that require wallet key should be executed on background.
        */
        const { key } = await backgroundRequest.wallet.getWalletKey()
        setWallet(key)

        /* 
          TODO: Will add affiliate functions to method of account classes.
        */
        if (!affiliateCodeStorage && account.type === TYPE.ARWEAVE) {
          koi.wallet = wallet
          koi.address = account.address

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
    /* 
      Gallery setting
      - Options: showViews, showEarnedKoi
      - Flag: showWelcomeScreen - true for the first time opened, then false.
    */
    const loadSettings = async () => {
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
      console.log('Loading for user data and setting...')
      getUserData()
      loadSettings()
    }
  }, [account])

  /* 
    Load for all assets
    This list of assets will include assets of every imported accounts.
  */
  useEffect(() => {
    const loadAssets = async () => {
      try {
        await backgroundRequest.assets.loadContent()
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

    if (!isEmpty(wallets) && !GALLERY_IMPORT_PATH.includes(pathname))
      loadAssets()
  }, [account])

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
        const assets = await _account.get.assets()
        setCardInfos(assets)
      } else {
        const allAssets = await popupAccount.getAllAssets()
        setCardInfos(allAssets)
      }
    }

    if (!GALLERY_IMPORT_PATH.includes(pathname)) setAssetsForCreateCollection()
  }, [showCreateCollection])

  useEffect(() => {
    setFile(acceptedFiles ? acceptedFiles[0] : {})
    if (!isEmpty(acceptedFiles)) history.push('/create')
  }, [acceptedFiles])

  /*
    Redirect to create NFT page to support create new NFT in case import new wallet
  */
  useEffect(() => {
    if (!isEmpty(file)) history.push('/create')
  }, [file])

  const modifyDraging = useCallback(
    throttle((newValue) => {
      setIsDragging(newValue)
    }, 500),
    []
  )

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

  const showDropzone = () => {
    modifyDraging(true)
  }

  const onClearFile = () => {
    setFile({})
  }

  const onCloseUploadModal = () => {
    setFile({})
    setIsDragging(false)
  }

  const _setError = (message) => {
    setError(null)
    setError(message)
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
        inviteSpent,
        isDragging,
        isWaitingAddNFT,
        onClearFile,
        onCloseUploadModal,
        page,
        searchTerm,
        setAccount,
        setCollectionNFT,
        setCollections,
        setCollectionsLoaded,
        setDemoCollections,
        setError: _setError,
        setFile,
        setIsLoading,
        setIsWaitingAddNFT,
        setNeedUpdateWallet,
        setNotification,
        setPage,
        setSearchTerm,
        setShowCreateCollection,
        setShowEarnedKoi,
        setShowExportModal,
        setShowSelectAccount,
        setShowShareModal,
        setShowSuccessUploadNFT,
        setShowViews,
        setShowWelcome,
        setStage,
        setTotalPage,
        showCreateCollection,
        showEarnedKoi,
        showViews,
        stage,
        totalAr,
        totalKoi,
        totalPage,
        totalReward,
        wallet,
        wallets,
        importedAddress,
        setImportedAddress
      }}
    >
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
          {error && <Message children={error}/>}
          {notification && <Message children={notification} type='notification'/> }
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
          {showSuccessUploadNFT && (
            <SuccessUploadNFT 
              onClose={() => {
                setShowSuccessUploadNFT(false)
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

          {children}
          {!GALLERY_IMPORT_PATH.includes(pathname) && <Footer showDropzone={showDropzone} />}
          {!GALLERY_IMPORT_PATH.includes(pathname) && <Navbar />}
        </div> : <div>Please unlock your wallet</div>}
        </> 
        : 
        <>
          {walletLoaded && <StartUp />}
        </>
      }
    </GalleryContext.Provider>
  )
}
