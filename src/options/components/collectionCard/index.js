import React, { useState, useMemo, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import ShareIcon from 'img/share-icon.svg'
import CopyLinkIcon from 'img/share-icon-2.svg'
import PrevArrowIcon from 'img/prev-arrow-icon.svg'
import NextArrowIcon from 'img/next-arrow-icon.svg'

import { formatNumber } from 'options/utils'
import './index.css'
import { Link } from 'react-router-dom'

export default ({ collection }) => {
  const {
    id,
    name,
    nfts,
    view,
    earnedKoi,
    contributors,
    pieces,
    tags,
    koiRockUrl,
  } = collection

  const [isCopied, setIsCopied] = useState(false)
  const [displayNftIndex, setDisplayNftIndex] = useState(1)
  const [displayTags, setDisplayTags] = useState([])
  const [expandTag, setExpandTag] = useState('')

  const displayNft = useMemo(() => nfts[displayNftIndex], [
    displayNftIndex,
    nfts,
  ])

  console.log({ displayNft })
  console.log({ displayNftIndex })

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
  }

  const showAllTags = () => {
    setDisplayTags(tags)
    setExpandTag('')
  }

  useEffect(() => {
    calculateDisplayTags()
  }, [tags])

  return (
    <div className='nft-collection-card-wrapper'>
      <div className='nft-collection-card'>
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
          {displayNft.contentType.includes('image') ? (
            <img src={displayNft.url} className='nft-img' />
          ) : (
            <video
              width={200}
              height={200}
              src={displayNft.url}
              className='nft-img'
              controls
              autoPlay
              muted
            />
          )}
        </div>
        <Link className='nft-name' to={`/details/${id}`}>
          {name}
        </Link>

        <div className='nft-view'>{view} KOI </div>
        <div className='nft-earned-koi'>{formatNumber(earnedKoi)} KOI</div>
        <div className='nft-stats'>
          <div className='contributors'>{contributors}</div>
          <div className='pieces'>{pieces}</div>
        </div>
        <div className='tags '>
          {displayTags.map((tag) => (
            <div key={tag} className='tag'>
              {tag}
            </div>
          ))}
          {expandTag && (
            <div key={expandTag} className='tag' onClick={showAllTags}>
              {expandTag}
            </div>
          )}
        </div>

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
