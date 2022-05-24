import React from 'react'

import { TYPE } from 'constants/accountConstants'

import NFTCardArweave from './NFTCardArweave'
import NFTCardEthereum from './NFTCardEthereum'
import NFTCardSolana from './NFTCardSolana'

const NFTCard = ({ nft }) => {
  if (nft.type === TYPE.ARWEAVE) return <NFTCardArweave nft={nft} />
  if (nft.type === TYPE.ETHEREUM) return <NFTCardEthereum nft={nft} />
  if (nft.type === TYPE.SOLANA) return <NFTCardSolana nft={nft} />
  return null
}

export default NFTCard
