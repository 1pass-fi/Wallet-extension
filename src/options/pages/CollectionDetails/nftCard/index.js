import React, { useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import isEmpty from 'lodash/isEmpty'

import ShareIcon from 'img/share-icon.svg'
import CopyLinkIcon from 'img/share-icon-2.svg'

import { formatNumber } from 'options/utils'
import './index.css'
import { Link } from 'react-router-dom'
import { stringTruncate } from 'options/utils'

import { GalleryContext } from 'options/galleryContext'
import getAssetByTxId from 'finnie-v2/selectors/getAssetByTxId'

export default ({ nft }) => {
  const { showViews, showEarnedKoi } = useContext(GalleryContext)
  const nftInfo = useSelector(getAssetByTxId(nft))

  if (isEmpty(nftInfo)) {
    // TODO - handle invalid NFT
    return <></>
  } else {
    const {
      txId,
      imageUrl: url,
      name,
      totalViews: views,
      earnedKoi,
      koiRockUrl,
      contentType
    } = nftInfo

    const [isCopied, setIsCopied] = useState(false)

    const onCopy = () => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 3000)
    }

    return (
      <div className="nft-simple-card-wrapper">
        <div className="nft-simple-card">
          <Link className="link-tag" to={`/v2/nfts/${txId}`}>
            <div className="preview-nft">
              {contentType?.includes('image') && <img src={url} className="nft-img" />}
              {contentType?.includes('video') && (
                <video width={200} height={200} src={url} className="nft-img" controls muted />
              )}
              {contentType?.includes('html') && (
                <div className="iframe-wrapper">
                  <iframe frameBorder="0" src={url} />
                  <div className="iframe-layer"></div>
                </div>
              )}
            </div>
            <div className="nft-name">{stringTruncate(name, 20)}</div>
          </Link>

          {showViews && <div className="nft-view">{views} Views </div>}
          {showEarnedKoi && <div className="nft-earned-koi">{formatNumber(earnedKoi)} KOII</div>}

          <div>
            {isCopied && <div className="copy-noti">Link copied!</div>}
            <CopyToClipboard text={koiRockUrl}>
              <CopyLinkIcon className="share-nft-button" onClick={onCopy} />
            </CopyToClipboard>
            <a target="_blank" href={koiRockUrl} className="nft-path">
              <ShareIcon />
            </a>
          </div>
        </div>
      </div>
    )
  }
}
