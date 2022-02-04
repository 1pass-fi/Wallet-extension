import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import formatNumber from 'finnie-v2/utils/formatNumber'
import formatLongString from 'finnie-v2/utils/formatLongString'

import NFTMedia from 'finnie-v2/components/NFTMedia'

import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import { GalleryContext } from 'options/galleryContext'

const NFTCard = ({ nft }) => {
  const { showViews, showEarnedKoi } = useContext(GalleryContext)

  return (
    <Link
      to={`/nfts/${nft.txId}`}
      className="relative text-white rounded bg-blue-800 w-46.75 h-62.5 pt-1.75 px-1.75"
    >
      <div className="flex justify-center items-center w-full h-37.75">
        <NFTMedia contentType={nft.contentType} source={nft.imageUrl} />
      </div>
      <div className="pl-1.75 flex flex-col mt-3.75 gap-y-1">
        <div className="font-semibold text-xs tracking-finnieSpacing-wide">
          {formatLongString(nft.name, 22)}
        </div>
        <div className="text-2xs tracking-finnieSpacing-wide text-warning">
          {formatLongString(nft.collection?.join(', '), 22)}
        </div>
        {showViews && <div className="text-2xs tracking-finnieSpacing-wide text-turquoiseBlue">
          {nft.totalViews + ` views`}
        </div>}
        {showEarnedKoi && <div className="text-2xs tracking-finnieSpacing-wide text-lightBlue">
          {formatNumber(nft.earnedKoi, 2) + ` KOII earned`}
        </div>}
      </div>
      <KoiiLogo className="absolute w-5 h-5 bottom-1.75 right-1.75" />
    </Link>
  )
}

export default NFTCard
