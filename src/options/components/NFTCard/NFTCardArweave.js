import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import { get } from 'lodash'
import NFTMedia from 'options/components/NFTMedia'
import { GalleryContext } from 'options/galleryContext'
import formatLongString from 'options/utils/formatLongString'
import formatNumber from 'options/utils/formatNumber'
import { popupAccount } from 'services/account'

const NFTCard = ({ nft }) => {
  const { showViews, showEarnedKoi } = useContext(GalleryContext)
  const [ownerName, setOwnerName] = useState(null)

  useEffect(() => {
    const getOwnerName = async () => {
      const address = nft.address
      if (address) {
        const account = await popupAccount.getAccount({ address })
        const didData = await account.get.didData()
        if (didData) {
          const name = get(didData, 'state.name')
          if (name) setOwnerName(name)
        }
      }
    }

    getOwnerName()
  }, [])

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
        {/* <div className="text-2xs tracking-finnieSpacing-wide text-warning">
          {formatLongString(nft.collection?.join(', '), 22)}
        </div> */}
        {ownerName && <div className="font-semibold text-2xs tracking-finnieSpacing-wide">
          {formatLongString(ownerName, 22)}
        </div>}
        {showViews && <div className="text-2xs tracking-finnieSpacing-wide text-turquoiseBlue">
          {nft.totalViews + ' ' + chrome.i18n.getMessage('viewLc')}
        </div>}
        {showEarnedKoi && <div className="text-2xs tracking-finnieSpacing-wide text-lightBlue">
          {formatNumber(nft.earnedKoi, 2) + ' KOII ' + chrome.i18n.getMessage('earnedLc')}
        </div>}
      </div>
      <KoiiLogo className="absolute w-5 h-5 bottom-1.75 right-1.75" />
    </Link>
  )
}

export default NFTCard
