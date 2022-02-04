import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { isEmpty, find } from 'lodash'

import ToolTip from 'finnie-v2/components/ToolTip'

import Button from 'finnie-v2/components/Button'
import NavBar from 'finnie-v2/components/NavBar'
import NFTMedia from 'finnie-v2/components/NFTMedia'
import ShareNFTModal from './ShareNFTModal'

import BlockIcon from 'img/v2/block-icon.svg'
import LeaderboardIcon from 'img/v2/leaderboard-icon.svg'
import ShareIcon from 'img/v2/share-icon.svg'
import LinkIcon from 'img/v2/link-icon.svg'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'
import GoBackIcon from 'img/v2/back-icon.svg'

import { TYPE } from 'constants/accountConstants'
import formatDatetime from 'finnie-v2/utils/formatDatetime'
import formatNumber from 'finnie-v2/utils/formatNumber'
import { GalleryContext } from 'options/galleryContext'

const NFTDetail = () => {
  const history = useHistory()
  const { id } = useParams()
  const assets = useSelector(state => state.assets)

  const [ownerImported, setOwnerImported] = useState(true)
  const [nft, setNft] = useState({})
  const [showShareNFTModal, setShowShareNFTModal] = useState(false)

  const { setShowExportModal, handleShareNFT, showViews, showEarnedKoi } = useContext(GalleryContext)

  useEffect(() => {
    const getNft = () => {
      let nft = find(assets.nfts, { txId: id })

      if (isEmpty(nft)) {
        nft = find(assets.collectionNfts, { txId: id })
        setOwnerImported(false)
      } else {
        setOwnerImported(true)
      }
      setNft(nft)
    }

    if (assets && isEmpty(nft)) getNft()
  }, [assets])

  const isArweaveNft = useMemo(() => {
    return nft?.type === TYPE.ARWEAVE
  }, [nft])

  const disabledFeatures = useMemo(() => {
    return nft?.isBridging || nft?.isSending || nft?.type !== TYPE.ARWEAVE
  }, [nft])

  const handleGoBack = () => {
    history.goBack()
  }

  return (
    <div className="min-full min-h-screen h-full bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800">
      <div onClick={handleGoBack} className='w-11 h-11 absolute top-44 left-23 cursor-pointer'><GoBackIcon /></div>
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
                  {showEarnedKoi && <div className="w-48.5 h-full rounded bg-trueGray-100 bg-opacity-20 flex items-center justify-center">
                    KOII earned <br />
                    {formatNumber(nft.earnedKoi, 3)}
                  </div>}
                  {showViews && <div className="w-46 h-full rounded bg-trueGray-100 bg-opacity-20 flex items-center justify-center">
                    Total Views <br />
                    {nft.totalViews}
                  </div>}
                </div>
              )}
            </div>

            <div className="w-115 h-101 relative">
              <div className="finnieSpacing-tighter font-semibold text-5xl mb-2">{nft.name}</div>
              <div className="text-sm mb-2">{`Registered: ${formatDatetime(nft.createdAt)}`}</div>
              <div className="flex gap-4 mb-4">
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
              <p className="w-full max-h-12 overflow-y-scroll overflow-x-none break-words text-sm leading-6 pr-4 whitespace-pre-line">
                {nft.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 h-11 overflow-y-scroll">
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

              <div className="absolute bottom-0 w-full">
                {!nft.pending && (
                  <div className="w-full flex items-center justify-between h-11.5 mt-7.5 gap-5 mb-6">
                    <Button
                      disabled={disabledFeatures}
                      size="lg"
                      icon={ShareIcon}
                      className="h-full w-7/12"
                      text="Share for Rewards"
                      onClick={() => {
                        setShowShareNFTModal(true)
                      }}
                    />
                    <div
                      data-tip={!ownerImported ? `This NFT is owned by a wallet with the address ${nft.address}.<br>
                      Please import this wallet and continue to transfer NFT.` : ''}
                      className="h-full w-5/12"
                    >
                      <Button
                        disabled={disabledFeatures || !ownerImported}
                        size="lg"
                        icon={LinkIcon}
                        variant="inversed"
                        text="Transfer NFT"
                        className="w-full h-full"
                        onClick={() => handleShareNFT(nft.txId)}
                      />
                    </div>
                  </div>
                )}

                {!nft.pending && (
                  <div
                    className="h-11.5 w-full"
                    data-tip={!ownerImported ? `This NFT is owned by a wallet with the address ${nft.address}.<br>
                    Please import this wallet and continue to bridge NFT.` : ''}
                  >
                    <Button
                      size="lg"
                      icon={isArweaveNft ? EthLogo : ArweaveLogo}
                      variant="lightBlue"
                      text="Bridge your NFT to a different Blockchain"
                      onClick={() => setShowExportModal(nft)}
                      disabled={!ownerImported}
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
              <ToolTip />
            </div>
          </div>
        </div>
      )}
      {showShareNFTModal && (
        <ShareNFTModal txId={id} close={() => setShowShareNFTModal(false)} />
      )}
    </div>
  )
}

export default NFTDetail
