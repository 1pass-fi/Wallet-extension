import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import ShareIcon from 'img/share-icon.svg'
import CopyLinkIcon from 'img/share-icon-2.svg'

import { formatNumber } from 'options/utils'
import './index.css'
import { Link } from 'react-router-dom'

export default ({ nft }) => {
  const { txId, url, name, views, earnedKoi, koiRockUrl, contentType } = nft

  const [isCopied, setIsCopied] = useState(false)

  const onCopy = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }
  return (
    <div className='nft-simple-card-wrapper'>
      <div className='nft-simple-card'>
        <div className='preview-nft'>
          {contentType.includes('image') ? (
            <img src={url} className='nft-img' />
          ) : (
            <video
              width={200}
              height={200}
              src={url}
              className='nft-img'
              controls
              autoPlay
              muted
            />
          )}
        </div>
        <Link className='nft-name' to={`/details/${txId}`}>
          {name}
        </Link>

        <div className='nft-view'>{views} Views </div>
        <div className='nft-earned-koi'>{formatNumber(earnedKoi)} KOI</div>

        <div>
          {isCopied && <div className='copy-noti'>Link copied!</div>}
          <CopyToClipboard text={koiRockUrl}>
            <CopyLinkIcon className='share-nft-button' onClick={onCopy} />
          </CopyToClipboard>
          <a target='_blank' href={koiRockUrl} className='nft-path'>
            <ShareIcon />
          </a>
        </div>
      </div>
    </div>
  )
}
