import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import formatLongString from 'finnie-v2/utils/formatLongString'

import NFTMedia from 'finnie-v2/components/NFTMedia'

import AddIcon from 'img/v2/select-nfts/add-icon.svg'
import CheckIcon from 'img/v2/select-nfts/check-icon.svg'

import { GalleryContext } from 'options/galleryContext'

const NftSelectCard = ({ nft }) => {
  const { selectedNftIds, setSelectedNftIds, } = useContext(GalleryContext)

  const handleToggleAddNft = () => {
    if (selectedNftIds.includes(nft.txId)) {
      setSelectedNftIds(prev => prev.filter(id => id !== nft.txId))
    } else {
      setSelectedNftIds(prev => [...prev, nft.txId])
    }
  }

  return (
    <div 
      onClick={handleToggleAddNft}
      className="relative text-white rounded bg-blue-800 w-46.75 h-46.75 pt-1.75 px-1.75 cursor-pointer"
    >
      <div className='absolute w-6 h-6 top-4 right-4'>{ selectedNftIds.includes(nft.txId) ?
        <CheckIcon /> :
        <AddIcon />
      }</div>
      <div className="flex justify-center items-center w-full h-36">
        <NFTMedia contentType={nft.contentType} source={nft.imageUrl} />
      </div>
      <div className="pl-1.75 flex flex-col mt-2 gap-y-1">
        <div className="font-semibold text-xs tracking-finnieSpacing-wide">
          {formatLongString(nft.name, 22)}
        </div>
      </div>
    </div>
  )
}

export default NftSelectCard
