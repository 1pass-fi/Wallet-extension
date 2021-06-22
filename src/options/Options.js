import '@babel/polyfill'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash/isEmpty'
import throttle from 'lodash/throttle'
import isArray from 'lodash/isArray'

import Loading from 'options/loading'
import { BackgroundConnect, EventHandler } from 'utils/backgroundConnect'
import { getChromeStorage, setChromeStorage } from 'utils'
import { MESSAGES, STORAGE, PORTS } from 'koiConstants'
import { CreateEventHandler } from 'popup/actions/backgroundConnect'

import './Options.css'
import Footer from './footer'
import Content from './content'
import Header from './header'

import { GalleryContext } from './galleryContext'

import ShareNFT from 'options/modal/shareNFT'
import ExportNFT from 'options/modal/exportNFT'

import { getShareUrl, createShareWindow } from './helpers'

const backgroundConnect = new BackgroundConnect(PORTS.POPUP)


export default () => {
  const [isDragging, setIsDragging] = useState(false)
  const [cardInfos, setCardInfos] = useState([])
  const [totalKoi, setTotalKoi] = useState(0)
  const [file, setFile] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState(null)
  const [wallet, setWallet] = useState(null)
  const headerRef = useRef(null)

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: ['image/*', 'video/*', 'audio/*'],
    noClick: true,
  })

  useEffect(() => {
    const getData = async () => {
      console.log(getShareUrl('twitter', 'Y6sn84Cwl2rEhN2ukXxpCtvERAYJ3mrDx8WmbNjJLZU'))
      console.log(getShareUrl('facebook', 'Y6sn84Cwl2rEhN2ukXxpCtvERAYJ3mrDx8WmbNjJLZU'))
      console.log(getShareUrl('linkedin', 'Y6sn84Cwl2rEhN2ukXxpCtvERAYJ3mrDx8WmbNjJLZU'))
      try {
        const storage = await getChromeStorage([
          STORAGE.CONTENT_LIST,
          STORAGE.KOI_BALANCE,
          STORAGE.KOI_ADDRESS,
        ])
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
        setWallet(key)
      }
    )

    backgroundConnect.addHandler(loadContentSuccessHandler)
    backgroundConnect.addHandler(loadKeySuccessHandler)
    getData()
  }, [])

  useEffect(() => {
    setFile(acceptedFiles ? acceptedFiles[0] : {})
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

  const [showShareModal, setShowShareModal] = useState({ show: false, txid: null })
  const [showExportModal, setShowExportModal] = useState(false)

  return (
    <GalleryContext.Provider
      value={{
        setIsLoading,
        address,
        wallet,
        setShowExportModal,
        setShowShareModal
      }}
    >
      <div
        
        {...getRootProps({ className: 'app dropzone' })}
        onDragOver={() => modifyDraging(true)}
        onDragLeave={() => modifyDraging(false)}
      >
        {showShareModal.show && <ShareNFT txid={showShareModal.txid} onClose={() => {setShowShareModal({...showShareModal, show: false})}}/>}
        {showExportModal && <ExportNFT onClose={() => {setShowExportModal(false)}}/>}

        {isLoading && <Loading />}
        {isDragging && isEmpty(file) && (
          <input name='fileField' {...getInputProps()} />
        )}
        <Header totalKoi={totalKoi} headerRef={headerRef} />
        <Content
          cardInfos={cardInfos}
          isDragging={isDragging}
          onCloseUploadModal={onCloseUploadModal}
          file={file}
          onClearFile={onClearFile}
        />
        {!isDragging && <Footer showDropzone={showDropzone} />}
      </div>
    </GalleryContext.Provider>
  )
}
