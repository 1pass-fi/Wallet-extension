import React, { useContext, useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { find } from 'lodash'

import ShareIcon from 'img/share-icon.svg'
import CopyLinkIcon from 'img/share-icon-2.svg'
import CheckIcon from 'img/check-icon.svg'

import { formatNumber } from '../../../utils'
import './index.css'
import { Link } from 'react-router-dom'
import { GalleryContext } from 'options/galleryContext'

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
  const { showCreateCollection, 
    collectionNFT,
    setCollectionNFT,
    totalPage, 
    setTotalPage,
    stage,
    page,
    setPage
  } = useContext(GalleryContext)
  const [isCopied, setIsCopied] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(false)

  const onCopy = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  /* 
    Handle selecting new NFT to put to new colleciton.
    Take a look at: options/components/collection/CreateCollection
  */
  const addToCollection = () => {
    if (stage == 2) {
      if (!find(collectionNFT, v => v.id == txId)) {
        /* Click to select this picture */
        let nfts = [...collectionNFT]
        nfts = nfts.filter((nft) => !!nft.url)
        nfts.push({ 
          id: txId, 
          url: imageUrl, 
          contentType,
          name,
          views: 100,
          earnedKoi,
          koiRockUrl
        })
        if (nfts.length % 5 !== 0) {
          const addOn = 5 - (nfts.length % 5)
          for (let i = 0; i < addOn; i++) {
            nfts.push({})
          }
        }
        if (nfts.length / 5 !== totalPage) {
          setTotalPage(nfts.length / 5)
          setPage(totalPage)
        }
        setCollectionNFT([...nfts])
      } else {
        /* Click to unselect this picture */
        let nfts = [...collectionNFT]
        nfts = nfts.filter((nft) => nft.id !== txId)
        nfts.push({})
        const notEmptySlots = nfts.filter((nft) => nft.id)
        if ((notEmptySlots.length % 5 === 0 && notEmptySlots.length > 0)) {
          nfts = notEmptySlots
        }
        if (((totalPage - nfts.length / 5) === 1) && page === totalPage - 1) {
          setPage(page - 1)
        }
        setTotalPage(nfts.length / 5)
        setCollectionNFT([...nfts])
      }
    }
  }

  useEffect(() => {
    if (find(collectionNFT, v => v.id == txId)) {
      setSelectedCollection(true)
    } else {
      setSelectedCollection(false)
    }
  }, [collectionNFT])

  return choosen !== txId ? (
    <div onClick={showCreateCollection ? addToCollection : () => {}} disabled={disabled} className='nft-card'>
      <Link to={!showCreateCollection ? `/details/${txId}` : '#'}>
        {contentType.includes('image') ? (
          <div className={selectedCollection ? 'nft-img selected' : 'nft-img'}>
            <img src={imageUrl} />
            {selectedCollection && <div className='nft-img-checked-icon'><CheckIcon /></div>}
          </div>
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
