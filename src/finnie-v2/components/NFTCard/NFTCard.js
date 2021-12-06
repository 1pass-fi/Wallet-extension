import React from 'react'

import formatNumber from 'finnie-v2/utils/formatNumber'

import EthereumLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'
import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'

const nft = {
  address: 'ou-OUmrWuT0hnSiUMoyhGEbd3s5b_ce8QK0vhNwmno4',
  contentType: 'image/jpeg',
  createdAt: '1621220973',
  description: 'a picture of PS4',
  earnedKoi: 20.830554739043663,
  galleryUrl:
    'chrome-extension://bpkclbbpogepoipfcejgjiphflmhommf/options.html#/details/37Uw2P_pSbYYshxl9ceIBGOHJuUtmBEc26nC8aPQr6c',
  imageUrl: 'https://arweave.net/37Uw2P_pSbYYshxl9ceIBGOHJuUtmBEc26nC8aPQr6c',
  isKoiWallet: true,
  isRegistered: true,
  koiRockUrl: 'https://koii.live/37Uw2P_pSbYYshxl9ceIBGOHJuUtmBEc26nC8aPQr6c',
  name: 'PS4',
  totalViews: 17,
  txId: '37Uw2P_pSbYYshxl9ceIBGOHJuUtmBEc26nC8aPQr6c',
  type: 'TYPE_ARWEAVE'
}

const NFTCard = () => {
  return (
    <div className="relative text-white rounded bg-blue-800 w-46.75 h-62.5 pt-1.75 px-1.75">
      <div className="w-42.5 h-37.75">
        <img src={nft.imageUrl} className="w-fulll h-full object-cover rounded" />
      </div>
      <div className="pl-1.75 flex flex-col mt-3.75 gap-y-1">
        <div className="font-semibold text-xs tracking-finnieSpacing-wide">{nft.name}</div>
        <div className="text-2xs font-light tracking-finnieSpacing-wide text-warnings">
          Category
        </div>
        <div className="text-2xs tracking-finnieSpacing-wide text-turquoiseBlue">
          {nft.totalViews + ` views`}
        </div>
        <div className="text-2xs tracking-finnieSpacing-wide text-lightBlue">
          {formatNumber(nft.earnedKoi, 2) + ` KOII earned`}
        </div>
      </div>
      <EthereumLogo className="absolute w-5 h-5 bottom-1.75 right-1.75" />
    </div>
  )
}

export default NFTCard
