import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import KoiIcon from 'img/koi-logo.svg'
import Button from 'popup/components/shared/button'

import './index.css'
import { formatNumber } from '../../utils'

export default ({
  txId,
  name,
  imageUrl,
  earnedKoi,
  isRegistered,
  koiRockUrl,
  setChoosen,
  bigCardRef,
  contentType,
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const onCopy = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  return (
    <div className='big-nft-card-wrapper' ref={bigCardRef}>
      <div className='big-nft-card'>
        {contentType.includes('image') ? (
          <img
            src={imageUrl}
            className='nft-img'
            onClick={() => setChoosen('')}
          />
        ) : (
          <video
            width={320}
            height={240}
            src={imageUrl}
            className='nft-img'
            controls
            autoPlay
          />
        )}
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
