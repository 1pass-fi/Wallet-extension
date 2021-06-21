import React, { useEffect, useRef, useState } from 'react'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'

import UploadNFT from './uploadNFT'
import BigCard from './bigNFTCard'
import Card from './nftCard'

import './index.css'

export default ({
  cardInfos,
  isDragging,
  file,
  onClearFile,
  onCloseUploadModal,
  setIsLoading,
  address,
  wallet,
}) => {
  const [choosen, setChoosen] = useState('')
  const bigCardRef = useRef(null)

  useEffect(() => {
    const query = window.location.search
    let id = ''
    if (query.length > 4) {
      id = query.slice(4)
    }
    if (id) {
      setChoosen(id)
    }
  }, [])

  useEffect(() => {
    if (bigCardRef.current) {
      bigCardRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [choosen])

  const choosenCard = find(cardInfos, { txId: choosen })

  return (
    <div className='app-content'>
      <div className='title'>My NFT Gallery</div>
      <UploadNFT
        isDragging={isDragging}
        file={file}
        onClearFile={onClearFile}
        onCloseUploadModal={onCloseUploadModal}
        setIsLoading={setIsLoading}
        address={address}
        wallet={wallet}
      />
      <div className='cards'>
        <div className='small-cards'>
          {cardInfos.map((cardInfo) =>
            isEqual(cardInfo, choosenCard) ? (
              <BigCard
                {...choosenCard}
                setChoosen={setChoosen}
                bigCardRef={bigCardRef}
              />
            ) : (
              <Card
                disabled={isDragging}
                choosen={choosen}
                setChoosen={setChoosen}
                {...cardInfo}
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}
