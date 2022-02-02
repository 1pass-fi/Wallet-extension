import React, { useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import Button from 'finnie-v2/components/Button'
import NavBar from 'finnie-v2/components/NavBar'
import NFTMedia from 'finnie-v2/components/NFTMedia'

import BlockIcon from 'img/v2/block-icon.svg'
import LeaderboardIcon from 'img/v2/leaderboard-icon.svg'
import ShareIcon from 'img/v2/share-icon.svg'
import LinkIcon from 'img/v2/link-icon.svg'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'

import { TYPE } from 'constants/accountConstants'
import formatDatetime from 'finnie-v2/utils/formatDatetime'
import formatNumber from 'finnie-v2/utils/formatNumber'
import { GalleryContext } from 'options/galleryContext'

import getAssetByTxId from 'finnie-v2/selectors/getAssetByTxId'

const NFTDetail = () => {
  const { id } = useParams()

  const { setShowExportModal, setShowShareModal, handleShareNFT } = useContext(GalleryContext)

  const nft = useSelector(getAssetByTxId(id))

  const isArweaveNft = useMemo(() => {
    return nft?.type === TYPE.ARWEAVE
  }, [nft])

  const disabledFeatures = useMemo(() => {
    return nft?.isBridging || nft?.isSending || nft?.type !== TYPE.ARWEAVE
  }, [nft])

  return (
    <div className="min-full min-h-screen h-full bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800">
      <NavBar />
      {nft && (
        <div className="flex h-full w-full text-white">
          <div className="mx-auto mt-28 flex flex-col md:flex-row">
            <div className="w-100.25 h-101 mr-7 relative">
              <NFTMedia contentType={nft.contentType} source={nft.imageUrl} showFull={true} />
              {!isArweaveNft ? (
                <EthLogo className="absolute bottom-2 right-2 w-9 shadow rounded-full" />
              ) : (
                <ArweaveLogo className="absolute bottom-2 right-2 w-9 shadow rounded-full" />
              )}

              {nft.type === TYPE.ARWEAVE && !nft.pending && (
                <div className="flex justify-between items-center h-17.25 mt-6.5 tracking-finnieSpacing-tight text-lg text-center">
                  <div className="w-48.5 h-full rounded bg-trueGray-100 bg-opacity-20 flex items-center justify-center">
                    KOII earned <br />
                    {formatNumber(nft.earnedKoi, 3)}
                  </div>
                  <div className="w-46 h-full rounded bg-trueGray-100 bg-opacity-20 flex items-center justify-center">
                    Total Views <br />
                    {nft.totalViews}
                  </div>
                </div>
              )}
            </div>

            <div className="w-115 h-101 relative">
              <div className="finnieSpacing-tighter font-semibold text-5xl mb-2 truncate">
                {nft.name}
              </div>
              <div className="text-sm mb-2">{`Registered: ${formatDatetime(nft.createdAt)}`}</div>
              <div className="flex gap-4 mb-5">
                <a href={`https://viewblock.io/arweave/tx/${nft.txId}`} target="_blank">
                  <Button
                    disabled={disabledFeatures}
                    icon={BlockIcon}
                    text={nft.pending ? 'Pending Transaction' : 'Explore Block'}
                    variant="inversed"
                    className="border-opacity-20"
                  />
                </a>
                <a href={`https://koi.rocks/`} target="_blank">
                  <Button
                    disabled={disabledFeatures}
                    icon={LeaderboardIcon}
                    text="Leaderboard"
                    variant="warning"
                  />
                </a>
              </div>
              <p className="w-full h-18 overflow-y-scroll text-sm leading-6 pr-4 whitespace-pre-line">
                {nft.description}
              </p>
              <div className="flex flex-wrap gap-x-2.5 gap-y-1 h-11 overflow-y-scroll">
                {nft.tags &&
                  nft.tags.map((tag) => (
                    <div
                      key={tag}
                      className="bg-lightBlue text-indigo tracking-finnieSpacing-wide text-xs rounded-full h-5 py-0.5 px-3"
                    >
                      {tag}
                    </div>
                  ))}
              </div>

              {!nft.pending && (
                <div className="flex items-center justify-between h-11.5 mt-7.5 gap-5">
                  <Button
                    disabled={disabledFeatures}
                    size="lg"
                    icon={ShareIcon}
                    className="h-full w-7/12"
                    text="Share for Rewards"
                    onClick={() => {
                      setShowShareModal({ show: true, txid: nft.txId })
                    }}
                  />
                  <Button
                    disabled={disabledFeatures}
                    size="lg"
                    icon={LinkIcon}
                    variant="inversed"
                    className="h-full w-5/12"
                    text="Transfer NFT"
                    onClick={() => handleShareNFT(nft.txId)}
                  />
                </div>
              )}

              {!nft.pending && (
                <Button
                  size="lg"
                  icon={isArweaveNft ? EthLogo : ArweaveLogo}
                  variant="lightBlue"
                  text="Bridge your NFT to a different Blockchain"
                  className="h-11.5 absolute bottom-0 w-full"
                  onClick={() => setShowExportModal(nft)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NFTDetail
