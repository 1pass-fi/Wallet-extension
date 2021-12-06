import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { popupAccount } from 'services/account'
import { setAssets } from 'options/actions/assets'

import MainLayout from 'finnie-v2/components/MainLayout'
import NFTCard from 'finnie-v2/components/NFTCard'

const Gallery = () => {
  const dispatch = useDispatch()
  const assets = useSelector((state) => state.assets)

  useEffect(() => {
    const loadNFTCards = async () => {
      await popupAccount.loadImported()

      const allAssets = await popupAccount.getAllAssets()
      const validAssets = allAssets.filter((asset) => asset.name !== '...')

      dispatch(setAssets({ nfts: validAssets }))
    }

    loadNFTCards()
  }, [])

  return (
    <MainLayout title="Gallery">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-3.75 place-items-center">
        {assets.nfts.map((nft) => (
          <NFTCard nft={nft} key={nft.txId} />
        ))}
      </div>
    </MainLayout>
  )
}

export default Gallery
