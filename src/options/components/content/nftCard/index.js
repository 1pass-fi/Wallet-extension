import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import ShareIcon from 'img/share-icon.svg'
import CopyLinkIcon from 'img/share-icon-2.svg'

import { formatNumber } from '../../../utils'
import './index.css'
import { Link } from 'react-router-dom'

export default ({
  txId,
  name,
  imageUrl,
  earnedKoi,
  isRegistered,
  koiRockUrl,
  choosen,
  disabled,
  contentType,
}) => {
  const [isCopied, setIsCopied] = useState(false)

  const onCopy = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  return choosen !== txId ? (
    <div disabled={disabled} className='nft-card'>
      <Link to={`/details/${txId}`}>
        {contentType.includes('image') ? (
          <img src={imageUrl} className='nft-img' />
        ) : (
          <video
            width={200}
            height={200}
            src={imageUrl}
            className='nft-img'
            controls
            autoPlay
            muted
          />
        )}
      </Link>
      <div className='nft-name'>{name}</div>
      {isRegistered ? (
        <div className='nft-earned-koi'>{formatNumber(earnedKoi)} KOI</div>
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
