import React from 'react'
import OpenIcon from 'img/v2/open-icon-white.svg'
import NFTMedia from 'options/components/NFTMedia'

const NFTCard = ({ nft }) => {
  const goToNft = () => {
    const url = chrome.extension.getURL(`options.html#/nfts/${nft.txId}`)
    chrome.tabs.create({ url })
  }

  return (
    <div
      className="flex relative shadow-md justify-center items-center w-full h-37.75 cursor-pointer"
      onClick={goToNft}
      style={{ width: '130px', height: '135px' }}
    >
      <div className="w-full h-full absolute top-0 left-0 flex flex-col items-center justify-center z-10 rounded hover:bg-warmGray hover:bg-opacity-80 opacity-0 hover:opacity-100">
        <div className="text-white text-center w-full px-3 truncate">{nft.name}</div>
        <OpenIcon className="w-5 h-5.5 mt-4" />
      </div>
      <NFTMedia contentType={nft.contentType} source={nft.imageUrl} />
    </div>
  )
}

export default NFTCard
