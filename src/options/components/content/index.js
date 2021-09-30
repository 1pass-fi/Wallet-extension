import React, { useState, useContext, useEffect } from 'react'
import get from 'lodash/get'
import includes from 'lodash/includes'
import toLower from 'lodash/toLower'
import isEqual from 'lodash/isEqual'
import { useLocation } from 'react-router'

import { GalleryContext } from 'options/galleryContext'
import CreateCollection from 'options/components/collections/CreateCollection'

import Card from './nftCard'

import './index.css'

export default ({ choosenTxid = '', detail }) => {
  const {
    cardInfos,
    isDragging,
    searchTerm,
    showCreateCollection,
  } = useContext(GalleryContext)
  const { pathname } = useLocation()
  const [showCards, setShowCards] = useState(true)
  const [pathnameLoaded, setPathnameLoaded] = useState(false)

  useEffect(() => {
    if (pathname.includes('details')) {
      setShowCards(false)
    } else {
      setShowCards(true)
    }
    setPathnameLoaded(true)
  }, [pathname])

  return (
    <div
      className="app-content"
      style={{ visibility: showCards ? 'visible' : 'hidden' }}
    >
      {<div className="title">Gallery</div>}
      {showCreateCollection && (
        <div className="create-collection-container">
          <CreateCollection />
        </div>
      )}

      <div className="cards">
        { pathnameLoaded &&
          <div className="small-cards">
            {cardInfos.map(
              (cardInfo) =>
                isEqual(get(cardInfo, 'txId', ''), choosenTxid) ||
                (includes(
                  toLower(get(cardInfo, 'name', '')),
                  toLower(searchTerm)
                ) && (
                  <Card
                    key={get(cardInfo, 'txId', cardInfo.name)}
                    disabled={isDragging}
                    choosen={choosenTxid}
                    {...cardInfo}
                  />
                ))
            )}
          </div>
        }
      </div>
    </div>
  )
}
