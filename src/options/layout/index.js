import '@babel/polyfill'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { history, useHistory } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash/isEmpty'
import throttle from 'lodash/throttle'
import isArray from 'lodash/isArray'

import { BackgroundConnect, EventHandler } from 'utils/backgroundConnect'
import { 
  getAffiliateCode, 
  getChromeStorage, 
  setChromeStorage, 
  getTotalRewardKoi, 
  checkAffiliateInviteSpent } from 'utils'
import { MESSAGES, STORAGE, PORTS } from 'koiConstants'
import { CreateEventHandler } from 'popup/actions/backgroundConnect'

import './index.css'
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
import { koi } from 'background'

const backgroundConnect = new BackgroundConnect(PORTS.POPUP)

export default ({ children }) => {
  const history = useHistory()

  const [isDragging, setIsDragging] = useState(false)
  const [cardInfos, setCardInfos] = useState([])
  const [totalKoi, setTotalKoi] = useState(0)
  const [totalAr, setTotalAr] = useState(0)
  const [file, setFile] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState(null)
  const [wallet, setWallet] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const headerRef = useRef(null)
  const [affiliateCode, setAffiliateCode] = useState(null)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const [totalReward, setTotalReward] = useState(null)
  const [inviteSpent, setInviteSpent] = useState(false)

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: ['image/*', 'video/*', 'audio/*'],
    noClick: true,
  })

  useEffect(() => {
    const getData = async () => {
      try {
        const storage = await getChromeStorage([
          STORAGE.CONTENT_LIST,
          STORAGE.KOI_BALANCE,
          STORAGE.KOI_ADDRESS,
          STORAGE.AR_BALANCE,
          STORAGE.AFFILIATE_CODE,
          STORAGE.SHOW_WELCOME_SCREEN
        ])
        if (!storage[STORAGE.SHOW_WELCOME_SCREEN]) {
          setShowWelcome(true)
          setChromeStorage({ [STORAGE.SHOW_WELCOME_SCREEN]: 1 })
        }
        if (storage[STORAGE.AFFILIATE_CODE]) {
          setAffiliateCode(storage[STORAGE.AFFILIATE_CODE])
        }
        if (storage[STORAGE.CONTENT_LIST]) {
          setCardInfos(storage[STORAGE.CONTENT_LIST])
        } else {
          // setIsLoading(true)
          // backgroundConnect.postMessage({
          //   type: MESSAGES.LOAD_CONTENT,
          // })
        }
        setIsLoading(true)
        backgroundConnect.postMessage({
          type: MESSAGES.LOAD_CONTENT,
        })
        if (storage[STORAGE.KOI_BALANCE]) {
          setTotalKoi(storage[STORAGE.KOI_BALANCE])
          setTotalAr(storage[STORAGE.AR_BALANCE])
        }
        if (storage[STORAGE.KOI_ADDRESS]) {
          setAddress(storage[STORAGE.KOI_ADDRESS])
          backgroundConnect.postMessage({
            type: MESSAGES.GET_WALLET,
          })
        }
      } catch (err) {
        console.log(err.message)
      }
    }
    const loadContentSuccessHandler = new CreateEventHandler(
      MESSAGES.LOAD_CONTENT_SUCCESS,
      async (response) => {
        const { contentList } = response.data
        isArray(contentList) && setCardInfos(contentList)
        await setChromeStorage({ [STORAGE.CONTENT_LIST]: contentList })
        setIsLoading(false)
      }
    )
    const loadKeySuccessHandler = new CreateEventHandler(
      MESSAGES.GET_WALLET_SUCCESS,
      async (response) => {
        const { key } = response.data
        const storage = await getChromeStorage([
          STORAGE.AFFILIATE_CODE
        ])
        if (!storage[STORAGE.AFFILIATE_CODE]) {
          koi.wallet = key
          await koi.getWalletAddress()
          const code = await getAffiliateCode(koi)
          const reward = await getTotalRewardKoi(koi)
          const spent = await checkAffiliateInviteSpent(koi)
          setAffiliateCode(code)
          setTotalReward(reward)
          setInviteSpent(spent)
        }
        setWallet(key)
      }
    )

    backgroundConnect.addHandler(loadContentSuccessHandler)
    backgroundConnect.addHandler(loadKeySuccessHandler)
    getData()
  }, [])

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
    if (isDragging && headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isDragging])

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

  const [showShareModal, setShowShareModal] = useState({
    show: false,
    txid: null,
  })
  const [showExportModal, setShowExportModal] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

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
        inviteSpent
      }}
    >
      <div
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

        {isLoading && <Loading />}
        {isDragging && isEmpty(file) && (
          <input name='fileField' {...getInputProps()} />
        )}
        <Header totalKoi={totalKoi} totalAr={totalAr} headerRef={headerRef} />
        {children}
        {!isDragging && <Footer showDropzone={showDropzone} />}
        <Navbar />
      </div>
    </GalleryContext.Provider>
  )
}
