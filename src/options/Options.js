import '@babel/polyfill'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useQuery } from 'react-router-dom'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import { BackgroundConnect, EventHandler } from 'utils/backgroundConnect'
import { getChromeStorage } from 'utils'

import KoiIcon from 'img/koi-logo.svg'
import KoiUnit from 'img/koi-logo-no-bg.svg'
import SettingsIcon from 'img/settings-icon.svg'
import ShareIcon from 'img/share-icon.svg'

import './Options.css'
import { MESSAGES, STORAGE, PORTS } from '../constants'

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

const BigCard = ({
  txId,
  name,
  imageUrl,
  earnedKoi,
  isRegistered,
  viewblockUrl,
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
        <a target="_blank" href={viewblockUrl} className='nft-path'>
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
  viewblockUrl,
  choosen,
  setChoosen,
}) => {
  return choosen !== txId ? (
    <div className='nft-card' onClick={() => setChoosen(txId)}>
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
        <a target="_blank" href={viewblockUrl} className='nft-path'>
          <ShareIcon />
        </a>
      )}
    </div>
  ) : null
}

const Content = ({ cardInfos }) => {
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
      <div className='cards'>
        {!isEmpty(choosenCard) && (
          <BigCard {...choosenCard} setChoosen={setChoosen} />
        )}
        <div className='small-cards'>
          {cardInfos.map((cardInfo) => (
            <Card choosen={choosen} setChoosen={setChoosen} {...cardInfo} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default () => {
  const [cardInfos, setCardInfos] = useState([])
  const [totalKoi, setTotalKoi] = useState(0)

  useEffect(() => {
    const getData = async () => {
      try {
        const storage = await getChromeStorage([STORAGE.KOI_ADDRESS, STORAGE.CONTENT_LIST])
        if (storage[STORAGE.CONTENT_LIST]) {
          setCardInfos(storage[STORAGE.CONTENT_LIST])
        }
        if (storage[STORAGE.KOI_ADDRESS]) {
          const address = storage[STORAGE.KOI_ADDRESS]
          backgroundConnect.postMessage({
            type: MESSAGES.LOAD_WALLET,
            data: { data: address }
          })
        }
      } catch (err) {
        console.log(err.message)
      }
    }
    const getKoiHandler = new EventHandler(MESSAGES.LOAD_WALLET_SUCCESS, response => {
      const { koiData } = response.data

      setTotalKoi(koiData.koiBalance)
    })
    backgroundConnect.addHandler(getKoiHandler)
    getData()
  }, [])

  return (
    <div className='app'>
      <Header totalKoi={totalKoi} />
      <Content cardInfos={cardInfos} />
    </div>
  )
}
