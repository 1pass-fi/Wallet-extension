import '@babel/polyfill'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import throttle from 'lodash/throttle'
import isArray from 'lodash/isArray'

import Loading from 'options/loading'
import { BackgroundConnect, EventHandler } from 'utils/backgroundConnect'
import { getChromeStorage, setChromeStorage } from 'utils'
import { MESSAGES, STORAGE, PORTS } from 'koiConstants'

import KoiIcon from 'img/koi-logo.svg'
import KoiUnit from 'img/koi-logo-no-bg.svg'
import SettingsIcon from 'img/settings-icon.svg'
import ShareIcon from 'img/share-icon.svg'
import CopyLinkIcon from 'img/share-icon-2.svg'
import AddButton from 'img/add-button.svg'

import './Options.css'
import UploadNFT from './uploadNFT'
import { CreateEventHandler } from 'popup/actions/backgroundConnect'
import Button from 'popup/components/shared/button'

const backgroundConnect = new BackgroundConnect(PORTS.POPUP)

const Header = ({ totalKoi }) => {
  return (
    <header className='app-header'>
      <div className='header-left'>
        <KoiIcon className='logo' />
      </div>
      <div className='header-right'>
        {totalKoi ? (
          <div className='total-koi'>
            <div>{totalKoi}</div>
            <KoiUnit className='koi-unit' />
          </div>
        ) : (
          <a
            target='_blank'
            href='https://koi.rocks/faucet?step=0'
            className='no-koi'
          >
            <div className='get-some'>No KOI? Get some</div>
          </a>
        )}
        <button className='setting-button'>
          <SettingsIcon className='option setting-icon'></SettingsIcon>
        </button>
      </div>
    </header>
  )
}

const Footer = ({ showDropzone }) => {
  return (
    <footer className='footer-wrapper'>
      <div className='footer-content'>
        <AddButton className='add-nft-button' onClick={showDropzone} />
        <div className='footer-text'>
          Drag & drop any file onto this page to create a new NFT
        </div>
      </div>
    </footer>
  )
}

const BigCard = ({
  txId,
  name,
  imageUrl,
  earnedKoi,
  isRegistered,
  koiRockUrl,
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const onCopy = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  return (
    <div className='big-nft-card-wrapper'>
      <div className='big-nft-card'>
        <img src={imageUrl} className='nft-img' />
        <div className='nft-name'>{name}</div>
        {isRegistered ? (
          <div className='nft-earned-koi'>{earnedKoi} KOI</div>
        ) : (
          <button className='register-button'>
            <KoiIcon className='icon' /> Register &amp; Earn
          </button>
        )}
        {isRegistered && (
          <>
            <CopyToClipboard text={koiRockUrl}>
              <>
                {isCopied && <div className='copy-noti'>Link copied!</div>}
                <Button
                  label='Share'
                  type='outline'
                  className='share-nft-button'
                  onClick={onCopy}
                />
              </>
            </CopyToClipboard>
            <a target='_blank' href={koiRockUrl} className='nft-path'>
              View on koi.rocks
            </a>
          </>
        )}
      </div>
    </div>
  )
}

const Card = ({
  txId,
  name,
  imageUrl,
  earnedKoi,
  isRegistered,
  koiRockUrl,
  choosen,
  setChoosen,
  disabled,
  contentType
}) => {
  const [isCopied, setIsCopied] = useState(false)

  const onCopy = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  const onClick = () => {
    setChoosen(txId)
  }

  return choosen !== txId ? (
    <div disabled={disabled} className='nft-card'>
      { contentType.includes('image') ?
        <img src={imageUrl} className='nft-img' onClick={onClick} /> :
        <video width={200} height={200} src={imageUrl} className='nft-img' onClick={onClick} />
      }
      <div className='nft-name'>{name}</div>
      {isRegistered ? (
        <div className='nft-earned-koi'>{earnedKoi} KOI</div>
      ) : (
        <button className='register-button'>
          <KoiIcon className='icon' /> Register &amp; Earn
        </button>
      )}
      {isRegistered && (
        <>
          {isCopied && <div className='copy-noti'>Link copied!</div>}
          <CopyToClipboard text={koiRockUrl}>
            <CopyLinkIcon className='share-nft-button' onClick={onCopy} />
          </CopyToClipboard>
          <a target='_blank' href={koiRockUrl} className='nft-path'>
            <ShareIcon />
          </a>
        </>
      )}
    </div>
  ) : null
}

const Content = ({
  cardInfos,
  isDragging,
  file,
  onClearFile,
  onCloseUploadModal,
  setIsLoading,
  address,
  wallet
}) => {
  const [choosen, setChoosen] = useState('')

  useEffect(() => {
    const query = window.location.search
    let id = ''
    if (query.length > 4) {
      id = query.slice(4)
    }
    if (id) {
      setChoosen(id)
    }
  }, [])

  const choosenCard = find(cardInfos, { txId: choosen })

  return (
    <div className='app-content'>
      <div className='title'>My NFT Gallery</div>
      <UploadNFT
        isDragging={isDragging}
        file={file}
        onClearFile={onClearFile}
        onCloseUploadModal={onCloseUploadModal}
        setIsLoading={setIsLoading}
        address={address}
        wallet={wallet}
      />
      <div className='cards'>
        <div className='small-cards'>
          {cardInfos.map((cardInfo) =>
            isEqual(cardInfo, choosenCard) ? (
              <BigCard {...choosenCard} />
            ) : (
              <Card
                disabled={isDragging}
                choosen={choosen}
                setChoosen={setChoosen}
                {...cardInfo}
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default () => {
  const [isDragging, setIsDragging] = useState(false)
  const [cardInfos, setCardInfos] = useState([])
  const [totalKoi, setTotalKoi] = useState(0)
  const [file, setFile] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState(null)
  const [wallet, setWallet] = useState(null)

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 1,
    accept: 'image/*',
  })


  useEffect(() => {
    const getData = async () => {
      try {
        const storage = await getChromeStorage([
          STORAGE.CONTENT_LIST,
          STORAGE.KOI_BALANCE,
          STORAGE.KOI_ADDRESS
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
            type: MESSAGES.GET_WALLET
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
    const loadKeySuccessHandler = new CreateEventHandler(MESSAGES.GET_WALLET_SUCCESS, async (response) => {
      const { key } = response.data
      setWallet(key)
    })

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

  const onClearFile = () => {
    setFile({})
  }

  const onCloseUploadModal = () => {
    setFile({})
    setIsDragging(false)
  }

  return (
    <div
      {...getRootProps({ className: 'app dropzone' })}
      onDragOver={() => modifyDraging(true)}
      onDragLeave={() => modifyDraging(false)}
    >
      {isLoading && <Loading />}
      {isDragging && isEmpty(file) && (
        <input name='fileField' {...getInputProps()} />
      )}
      <Header totalKoi={totalKoi} />
      <Content
        cardInfos={cardInfos}
        isDragging={isDragging}
        onCloseUploadModal={onCloseUploadModal}
        file={file}
        onClearFile={onClearFile}
        setIsLoading={setIsLoading}
        address={address}
        wallet={wallet}
      />
      {!isDragging && <Footer showDropzone={() => modifyDraging(true)} />}
    </div>
  )
}
