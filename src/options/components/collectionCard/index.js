import React, { useState, useMemo, useEffect, useRef, useContext } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { isEmpty, get } from 'lodash'
import { useSelector } from 'react-redux'

import ShareIcon from 'img/share-icon.svg'
import CopyLinkIcon from 'img/share-icon-2.svg'
import PrevArrowIcon from 'img/prev-arrow-icon.svg'
import NextArrowIcon from 'img/next-arrow-icon.svg'

import { formatNumber } from 'options/utils'
import './index.css'
import { Link } from 'react-router-dom'

import { stringTruncate } from 'options/utils'
import { GalleryContext } from 'options/galleryContext'

export default ({ collection }) => {
  const { showViews, showEarnedKoi } = useContext(GalleryContext)
  const {
    id,
    name,
    nfts,
    totalViews: views,
    contributors,
    pieces,
    tags,
    koiRockUrl,
    description,
  } = collection

  const [isCopied, setIsCopied] = useState(false)
  const [displayNftIndex, setDisplayNftIndex] = useState(0)
  const [displayTags, setDisplayTags] = useState([])
  const [expandTag, setExpandTag] = useState('')
  const [isExpand, setIsExpand] = useState(false)

  const defaultAccount = useSelector(state => state.defaultAccount)
  const earnedKoi = defaultAccount.totalReward

  const ref = useRef()

  const displayNft = useMemo(() => {
    try {
      return nfts[displayNftIndex]
    } catch (error) {
      console.error(err.message)
      return 0
    }
  }, [
    displayNftIndex,
    nfts,
  ])

  const onCopy = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  const displayNextNft = () => {
    setDisplayNftIndex(displayNftIndex + 1)
  }

  const displayPrevNft = () => {
    setDisplayNftIndex(displayNftIndex - 1)
  }

  const calculateDisplayTags = () => {
    if (!isEmpty(tags)) {
      const maxWidth = 216
      let currWidth = 0
      const gotTags = []
      while (currWidth < maxWidth) {
        // Calculate candidate tag width
        let nextTagWidth
        if (gotTags.length == 0) {
          nextTagWidth = tags[gotTags.length].length * 7 + 24
        } else {
          nextTagWidth = tags[gotTags.length].length * 7 + 24 + 8
        }
  
        // Calculate number of hidden tags width
        let hiddenTagsWidth = 0
        if (tags.length - gotTags.length != 1) {
          hiddenTagsWidth =
            ((tags.length - gotTags.length).toString.length + 2) * 7 + 12 + 8
        }
  
        // Candidate tag is accept or not
        if (currWidth + nextTagWidth + hiddenTagsWidth <= maxWidth) {
          gotTags.push(tags[gotTags.length])
          currWidth += nextTagWidth
        } else {
          break
        }
  
        // show all tags
        if (gotTags.length == tags.length) {
          setDisplayTags(gotTags)
          return
        }
      }
  
      if (tags.length == 1) {
        setDisplayTags(tags)
        return
      }
  
      setDisplayTags(gotTags)
      setExpandTag(`+${tags.length - gotTags.length}⋮`)
    } else {
      setDisplayTags([])
    }
  }

  const showAllTags = () => {
    setDisplayTags(tags)
    setExpandTag('')
    setIsExpand(true)
  }

  /* 
    Set collection data for detail collection.
    Later we will move component CollectionDetail to another page.
    This function will be removed.
  */
  const handleSetCollection = () => {
    setCollection({
      id,
      name,
      nfts,
      view,
      earnedKoi,
      contributors,
      pieces,
      tags,
      koiRockUrl,
      description,
    })
  }

  useEffect(() => {
    calculateDisplayTags()
  }, [tags])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!expandTag && ref.current && !ref.current.contains(event.target)) {
        setIsExpand(false)
        calculateDisplayTags()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

  return (
    <div className='nft-collection-card-wrapper'>
      <div
        className={`nft-collection-card ${isExpand ? 'expand' : ''}`}
        ref={ref}
      >
        <Link className='link-tag' to={`/collections/${id}`}>
          <div className='preview-nft'>
            {displayNftIndex > 0 && (
              <div className='prev-nft' onClick={displayPrevNft}>
                <PrevArrowIcon />
              </div>
            )}
            {displayNftIndex < pieces - 1 && (
              <div className='next-nft' onClick={displayNextNft}>
                <NextArrowIcon />
              </div>
            )}
            {displayNft?.contentType?.includes('image') && 
              <img src={get(displayNft, 'imageUrl')} className='nft-img' />
            }
            {displayNft?.contentType?.includes('video') &&
              <video
                width={200}
                height={200}
                src={get(displayNft, 'imageUrl')}
                className='nft-img'
                controls
                muted
              />
            }
            {displayNft?.contentType?.includes('html') &&
              <div className='iframe-wrapper'>
                <iframe frameBorder='0' src={get(displayNft, 'imageUrl')}/>
                <div className='iframe-layer'></div>
              </div>
            }
          </div>
          {/* <Link className='nft-name' to={`/details/${id}`}>
          {name}
        </Link> */}
          <div className='nft-name'>{stringTruncate(name, 20)}</div>

        </Link>

        {showViews && <div className='nft-view'>{views} Views </div>}
        {showEarnedKoi && <div className='nft-earned-koi'>{formatNumber(earnedKoi)} KOII</div>}
        <div className='nft-stats'>
          {/* <div className='contributors'>{contributors}</div> */}
          <div className='pieces'>{nfts.length}</div>
        </div>
        <div className='tags '>
          {displayTags.map((tag) => (
            <div key={tag} className='tag'>
              {stringTruncate(tag, 10) }
            </div>
          ))}
          {expandTag && (
            <div key={expandTag} className='tag' onClick={showAllTags}>
              {expandTag}
            </div>
          )}
        </div>

        <div>
          {/* {isCopied && <div className='copy-noti'>Link copied!</div>}
          <CopyToClipboard text={koiRockUrl}>
            <CopyLinkIcon className='share-nft-button' onClick={onCopy} />
          </CopyToClipboard>
          <a target='_blank' href={koiRockUrl} className='nft-path'>
            <ShareIcon />
          </a> */}
        </div>
      </div>
    </div>
  )
}
