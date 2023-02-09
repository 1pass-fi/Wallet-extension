import React from 'react'
import { Link } from 'react-router-dom'
import SolanaLogo from 'img/v2/solana-logo.svg'
import NFTMedia from 'options/components/NFTMedia'
import formatLongString from 'options/utils/formatLongString'

const NFTCard = ({ nft }) => {
  return (
    <Link
      to={`/nfts/${nft.txId}`}
      className="relative text-white rounded bg-blue-800 w-46.75 h-72 pt-1.75 px-1.75"
      role="gridcell"
    >
      <div className="flex justify-center items-center w-full h-37.75">
        <NFTMedia contentType={nft.contentType} source={nft.imageUrl} />
      </div>
      <div className="pl-1.75 flex flex-col mt-3.75 gap-y-1">
        <div className="font-semibold text-xs tracking-finnieSpacing-wide h-8 text-ellipsis overflow-hidden" title="nftname">
          {nft.name}
        </div>
        {/* <div className="text-2xs tracking-finnieSpacing-wide text-warning">Category</div> */}
      </div>
      <SolanaLogo className="absolute w-5 h-5 bottom-1.75 right-1.75" data-testid="solana-logo"/>
    </Link>
  )
}

export default NFTCard
