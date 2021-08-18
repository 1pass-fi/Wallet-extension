import '@babel/polyfill'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { history, useHistory } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash/isEmpty'
import throttle from 'lodash/throttle'
import isArray from 'lodash/isArray'
import { isNumber } from 'lodash'

import { BackgroundConnect, EventHandler } from 'utils/backgroundConnect'
import {
  getAffiliateCode, 
  getChromeStorage, 
  setChromeStorage, 
  getTotalRewardKoi, 
  checkAffiliateInviteSpent } from 'utils'
import { MESSAGES, STORAGE, PORTS, MOCK_COLLECTIONS_STORE } from 'koiConstants'
import { CreateEventHandler } from 'popup/actions/backgroundConnect'

import './index.css'
import StartUp from 'options/pages/StartUp'
import Loading from 'options/components/loading'
import Footer from 'options/components/footer'
import Header from 'options/components/header'
import Navbar from 'options/components/navbar'
import Message from 'options/components/message'

import { GalleryContext } from 'options/galleryContext'

import ShareNFT from 'options/modal/shareNFT'
import ExportNFT from 'options/modal/exportNFT'
import Welcome from 'options/modal/welcomeScreen'

import { getShareUrl, createShareWindow } from 'options/helpers'

import { Web } from '@_koi/sdk/web'
export const koi = new Web()

import { getNftsDataForCollections, loadCollections } from 'options/utils'

import storage from 'storage'
import { backgroundRequest } from 'popup/backgroundRequest'

import { popupAccount } from 'account'
import SelectAccountModal from 'options/modal/SelectAccountModal'
import SuccessUploadNFT from 'options/modal/SuccessUploadModal'


export default ({ children }) => {
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

  const [demoCollections, setDemoCollections] = useState([])
  const [collections, setCollections] = useState([])

  const [showShareModal, setShowShareModal] = useState({
    show: false,
    txid: null,
  })
  const [showExportModal, setShowExportModal] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  const [showSelectAccount, setShowSelectAccount] = useState(false)
  const [showSuccessUploadNFT, setShowSuccessUploadNFT] = useState(false)

  const headerRef = useRef(null)

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: ['image/*', 'video/*', 'audio/*'],
    noClick: true,
  })

  /* 
    Load for accounts
    Select the first wallet as account by default
  */
  useEffect(() => {
    const loadWallets = async () => {
      await popupAccount.loadImported()
      const allData = await popupAccount.getAllMetadata()
      console.log('allData', allData)

      // All Account: [{ account1, account2 }]
      setWallets(allData)

      /* 
        Set activatedAccount to account 
      */
      let activatedAccount = await storage.setting.get.activatedAccountAddress()
      activatedAccount = await popupAccount.getAccount({ address: activatedAccount })
      activatedAccount = await activatedAccount.get.metadata()

      setAccount(activatedAccount)
    }
    setIsLoading(true)
    loadWallets()
  }, [])

  useEffect(() => {
    const getDataFromStorage = async () => {
      try {
        /* 
          Contents, koiBalance, arBalance, address, affiliateCode, showWelcomeScreen, accountName
        */
        let allAssets
        // Get all contents

        /* 
          When show create collection form, filter NFTs by account.
          To make sure: Account1 can only create a new collection from Account1's NFTs
        */
        if (showCreateCollection) {
          const _account = await popupAccount.getAccount({ address: account.address })
          const assets = await _account.get.assets()
          setCollectionNFT([])
          setCardInfos(assets)
        } else {
          allAssets = await popupAccount.getAllAssets()
        }

        const aAccount = await popupAccount.getAccount({ address: account.address })
        // let contentList = await aAccount.get.assets()
      
        const addressStorage = account.address

        const arBalance = await aAccount.get.balance()
        const koiBalance = await aAccount.get.koiBalance()

        const arweaveAccountName = await aAccount.get.accountName()

        const showViewStorage = await storage.setting.get.showViews()
        const showEarnedKoiStorage = await storage.setting.get.showEarnedKoi()
        const showWelcomeScreen = await storage.setting.get.showWelcomeScreen()
        const affiliateCodeStorage = await storage.generic.get.affiliateCode()

        if (showViewStorage) setShowViews(showViewStorage)
        if (showEarnedKoiStorage) setShowEarnedKoi(showEarnedKoiStorage) 

        if (!showWelcomeScreen) {
          setShowWelcome(true)
          await storage.setting.set.showWelcomeScreen(1)
        }

        if (affiliateCodeStorage) setAffiliateCode(affiliateCodeStorage)
        if (allAssets) setCardInfos(allAssets)

        // Set address state
        // Do actions when have address (have wallet imported and unlocked).
        if (addressStorage) {
          const { key } = await backgroundRequest.wallet.getWalletKey()

          setAddress(addressStorage)
          setWallet(key)

          // Duplicate code. Will refactor.
          // Calculate balances when have pending transactions.
          if (isNumber(koiBalance) && isNumber(arBalance)) {
            let totalAr = arBalance
            let totalKoi = koiBalance
            console.log(totalAr, totalKoi)
            let pendingTransactions = await aAccount.get.pendingTransactions() || []
            pendingTransactions.forEach((transaction) => {
              if (isNumber(transaction.expense)) {
                switch (transaction.activityName) {
                  case 'Sent KOII':
                    totalKoi -= transaction.expense
                    break
                  case 'Sent AR':
                    totalAr -= transaction.expense
                }
              }
            })
            setTotalKoi(totalKoi)
            setTotalAr(totalAr)
          }
          
          // Load affiliate code
          if (!affiliateCodeStorage) {
            koi.wallet = key
            koi.address = addressStorage

            const code = await getAffiliateCode(koi)
            const reward = await getTotalRewardKoi(koi)
            const spent = await checkAffiliateInviteSpent(koi)
            setAffiliateCode(code)
            setTotalReward(reward)
            setInviteSpent(spent)
          }
        }

        // Set accountName state
        if (arweaveAccountName) {
          setAccountName(arweaveAccountName)
        }
      } catch (err) {
        console.log(err.message)
      }
    }

    if (!isEmpty(wallets)) getDataFromStorage()
  }, [account])

  /* 
    Load for all assets
  */
  useEffect(() => {
    const loadAssets = async () => {
      try {
        console.log('RUNNING LOAD ASSETS')
        await backgroundRequest.assets.loadContent()
        const allAssets =  await popupAccount.getAllAssets()
        setCardInfos(allAssets)
        if (isEmpty(allAssets)) history.push('/create')
        setIsLoading(false)
      } catch (err) {
        console.log(err.message)
        setIsLoading(false)
        setError(err.message)
      }
    }

    // if (!isEmpty(wallets)
    loadAssets()

  }, [])

  useEffect(() => {
    const setAssetsForCreateCollection = async () => {
      if (showCreateCollection) {
        const _account = await popupAccount.getAccount({ address: account.address })
        const assets = await _account.get.assets()
        setCardInfos(assets)
      } else {
        const allAssets = await popupAccount.getAllAssets()
        setCardInfos(allAssets)
      }
    }

    setAssetsForCreateCollection()
  }, [showCreateCollection])

  useEffect(() => {
    setFile(acceptedFiles ? acceptedFiles[0] : {})
    if (!isEmpty(acceptedFiles)) history.push('/create')
  }, [acceptedFiles])

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


  return (
    <GalleryContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        address,
        cardInfos,
        file,
        setFile,
        isDragging,
        onClearFile,
        onCloseUploadModal,
        setIsLoading,
        setShowExportModal,
        setShowShareModal,
        wallet,
        affiliateCode,
        setError,
        setNotification,
        totalReward,
        inviteSpent,
        showCreateCollection,
        collectionNFT,
        setCollectionNFT,
        totalPage,
        setTotalPage,
        setShowCreateCollection,
        totalKoi,
        totalAr,
        stage,
        setStage,
        page,
        setPage,
        demoCollections,
        setDemoCollections,
        collections,
        setCollections,
        showViews,
        showEarnedKoi,
        setShowViews,
        setShowEarnedKoi,
        accountName,
        setShowWelcome,
        collectionsLoaded,
        setCollectionsLoaded,
        wallets,
        account,
        setAccount,
        setShowSelectAccount,
        setShowSuccessUploadNFT,
        isWaitingAddNFT,
        setIsWaitingAddNFT
      }}
    >
      {!isEmpty(wallets) ? <div
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
        {showExportModal && (
          <ExportNFT
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
        <Header 
          totalKoi={totalKoi} 
          totalAr={totalAr} 
          headerRef={headerRef} 
          isLoading={isLoading} 
          isWaitingAddNFT={isWaitingAddNFT}
          setIsWaitingAddNFT={setIsWaitingAddNFT}
        />
        {children}
        <Footer showDropzone={showDropzone} />
        <Navbar />
      </div> : 
        <div className='app no-wallet'>
          <StartUp />
        </div>}
    </GalleryContext.Provider>
  )
}
