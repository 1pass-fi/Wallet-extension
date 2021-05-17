import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import find from 'lodash/find'

import KoiIcon from 'img/koi-logo.svg'
import KoiUnit from 'img/koi-logo-no-bg.svg'
import SettingsIcon from 'img/settings-icon.svg'
import ShareIcon from 'img/share-icon.svg'

import './Options.css'

const Header = ({ totalKoi }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <KoiIcon className="logo" />
      </div>
      <div className="header-right">
        <div className="total-koi">
          <div>
            {totalKoi}
          </div>
          <KoiUnit className="koi-unit" />
        </div>
        <button className="setting-button"><SettingsIcon /></button>
      </div>
    </header>
  )
}

const BigCard = ({ txId, name, imgSrc, earnedKoi, isRegistered, path, setChoosen }) => {
  return (
    <div className="big-nft-card" onClick={() => setChoosen('')}>
      <img src={imgSrc} className="nft-img" />
      <div className="nft-name">{name}</div>
      {isRegistered ? <div className="nft-earned-koi">{earnedKoi} KOI</div> : <button className="register-button"><KoiIcon className="icon" /> Register &amp; Earn</button>}
      {isRegistered && <Link to={path} className="nft-path">View on koi.rocks</Link>}
    </div>
  )
}

const Card = ({ txId, name, imgSrc, earnedKoi, isRegistered, path, choosen, setChoosen }) => {
  return (
    choosen !== txId
      ? <div className="nft-card" onClick={() => setChoosen(txId)}>
        <img src={imgSrc} className="nft-img" />
        <div className="nft-name">{name}</div>
        {isRegistered ? <div className="nft-earned-koi">{earnedKoi} KOI</div> : <button className="register-button"><KoiIcon className="icon" /> Register &amp; Earn</button>}
        {isRegistered && <Link to={path} className="nft-path"><ShareIcon /></Link>}
      </div >
      : null
  )
}

const Content = ({ cardInfos }) => {
  const [choosen, setChoosen] = useState('')
  const choosenCard = useMemo(() => find(cardInfos, { txId: choosen }), [choosen])

  return (
    <div className="app-content">
      <div className="title">My NFT Gallery</div>
      <div className="cards">
        {choosen && <BigCard {...choosenCard} setChoosen={setChoosen} />}
        <div className="small-cards">
          {cardInfos.map(cardInfo => <Card choosen={choosen} setChoosen={setChoosen} {...cardInfo} />)}
        </div>
      </div>
    </div>
  )
}

export default ({ cardInfos = [], totalKoi = 0 }) => {
  return (
    <div className="app">
      <Header totalKoi={totalKoi} />
      <Content cardInfos={cardInfos} />
    </div >
  )
}
