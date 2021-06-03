import '@babel/polyfill'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useQuery } from 'react-router-dom'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import throttle from 'lodash/throttle'

import { BackgroundConnect, EventHandler } from 'utils/backgroundConnect'
import { getChromeStorage } from 'utils'
import { MESSAGES, STORAGE, PORTS } from 'koiConstants'

import KoiIcon from 'img/koi-logo.svg'
import KoiUnit from 'img/koi-logo-no-bg.svg'
import SettingsIcon from 'img/settings-icon.svg'
import ShareIcon from 'img/share-icon.svg'
import AddButton from 'img/add-button.svg'

import './Options.css'
import UploadNFT from './uploadNFT'

const backgroundConnect = new BackgroundConnect(PORTS.POPUP)

const Header = ({ totalKoi }) => {
  return (
    <header className='app-header'>
      <div className='header-left'>
        <KoiIcon className='logo' />
      </div>
      <div className='header-right'>
        <div className='total-koi'>
          <div>{totalKoi}</div>
          <KoiUnit className='koi-unit' />
        </div>
        <button className='setting-button'>
          <SettingsIcon className='option setting-icon'></SettingsIcon>
        </button>
      </div>
    </header>
  )
}

const Footer = () => {}

const BigCard = ({
  txId,
  name,
  imageUrl,
  earnedKoi,
  isRegistered,
  koiRockUrl,
  setChoosen,
}) => {
  return (
    <div className='big-nft-card' onClick={() => setChoosen('')}>
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
        <a target='_blank' href={koiRockUrl} className='nft-path'>
          View on koi.rocks
        </a>
      )}
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
  titleRef,
}) => {
  const onClick = () => {
    setChoosen(txId)
    console.log('click')
    titleRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  return choosen !== txId ? (
    <div className='nft-card' onClick={onClick}>
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
        <a target='_blank' href={koiRockUrl} className='nft-path'>
          <ShareIcon />
        </a>
      )}
    </div>
  ) : null
}

const Content = ({ cardInfos, isDragging }) => {
  const [choosen, setChoosen] = useState('')
  const titleRef = useRef(null)

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
      <div className='title' ref={titleRef}>
        My NFT Gallery
      </div>
      <UploadNFT isDragging={isDragging} />
      <div className='cards'>
        {!isDragging && !isEmpty(choosenCard) && (
          <BigCard {...choosenCard} setChoosen={setChoosen} />
        )}
        <div className='small-cards'>
          {cardInfos.map((cardInfo) => (
            <Card
              choosen={choosen}
              setChoosen={setChoosen}
              {...cardInfo}
              titleRef={titleRef}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default () => {
  const [isDragging, setIsDragging] = useState(false)
  const [cardInfos, setCardInfos] = useState([])
  const [totalKoi, setTotalKoi] = useState(0)

  useEffect(() => {
    const getData = async () => {
      try {
        const storage = await getChromeStorage([
          STORAGE.KOI_ADDRESS,
          STORAGE.CONTENT_LIST,
        ])
        if (storage[STORAGE.CONTENT_LIST]) {
          setCardInfos(storage[STORAGE.CONTENT_LIST])
        }
        if (storage[STORAGE.KOI_ADDRESS]) {
          const address = storage[STORAGE.KOI_ADDRESS]
          backgroundConnect.postMessage({
            type: MESSAGES.LOAD_WALLET,
            data: { data: address },
          })
        }
      } catch (err) {
        console.log(err.message)
      }
    }
    const getKoiHandler = new EventHandler(
      MESSAGES.LOAD_WALLET_SUCCESS,
      (response) => {
        const { koiData } = response.data

        setTotalKoi(koiData.koiBalance)
      }
    )
    backgroundConnect.addHandler(getKoiHandler)
    getData()
  }, [])

  const modifyDraging = useCallback(
    throttle((newValue) => {
      setIsDragging(newValue)
    }, 500),
    []
  )

  return (
    <div
      className='app'
      onDragOver={(e) => {
        e.preventDefault()
        modifyDraging(true)
      }}
      onDragLeave={() => {
        modifyDraging(false)
      }}
      onDrop={() => {
        modifyDraging(false)
      }}
    >
      <Header totalKoi={totalKoi} />
      <Content cardInfos={cardInfos} isDragging={isDragging} />
      {!isDragging && (
        <footer className='footer-wrapper'>
          <div className='footer-content'>
            <AddButton
              className='add-nft-button'
              onClick={() => {
                modifyDraging(true)
              }}
            />
            <div className='footer-text'>
              Drag & drop any file onto this page to create a new NFT
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
