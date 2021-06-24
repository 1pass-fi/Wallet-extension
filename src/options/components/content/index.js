import React, { useEffect, useContext, useRef } from 'react'
import get from 'lodash/get'
import includes from 'lodash/includes'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'

import { GalleryContext } from 'options/galleryContext'

import UploadNFT from './uploadNFT'
import Card from './nftCard'
import BigCard from './bigNFTCard'

import './index.css'

export default ({ choosenTxid = '' }) => {
  const { cardInfos, isDragging, searchTerm } = useContext(GalleryContext)

  useEffect(() => {
    window.scroll({ top: 0, behavior: 'smooth' })
  }, [choosenTxid])

  const choosenCard = find(cardInfos, { txId: choosenTxid })

  return (
    <div className='app-content'>
      {!choosenCard && <div className='title'>Gallery</div>}
      <UploadNFT />
      <div className='cards'>
        {choosenCard && <BigCard {...choosenCard} />}
        <div className='small-cards'>
          {cardInfos.map(
            (cardInfo) =>
              isEqual(get(cardInfo, 'txId', ''), choosenTxid) ||
              (includes(get(cardInfo, 'name', ''), searchTerm) && (
                <Card
                  key={get(cardInfo, 'txId', '')}
                  disabled={isDragging}
                  choosen={choosenTxid}
                  {...cardInfo}
                />
              ))
          )}
        </div>
      </div>
    </div>
  )
}
