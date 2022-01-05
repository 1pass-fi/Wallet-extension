import React from 'react'
import { Link } from 'react-router-dom'

import formatLongString from 'finnie-v2/utils/formatLongString'

import NFTMedia from 'finnie-v2/components/NFTMedia'

import EthereumLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'

const NFTCard = ({ nft }) => {
  return (
    <Link
      to={`/v2/nfts/${nft.txId}`}
      className="relative text-white rounded bg-blue-800 w-46.75 h-62.5 pt-1.75 px-1.75"
    >
      <div className="flex justify-center items-center w-full h-37.75">
        <NFTMedia contentType={nft.contentType} source={nft.imageUrl} />
      </div>
      <div className="pl-1.75 flex flex-col mt-3.75 gap-y-1">
        <div className="font-semibold text-xs tracking-finnieSpacing-wide">
          {formatLongString(nft.name, 22)}
        </div>
        {/* <div className="text-2xs font-light tracking-finnieSpacing-wide text-warning">Category</div> */}
      </div>
      <EthereumLogo className="absolute w-5 h-5 bottom-1.75 right-1.75" />
    </Link>
  )
}

export default NFTCard
