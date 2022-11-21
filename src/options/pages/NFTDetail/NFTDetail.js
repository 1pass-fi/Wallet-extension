import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import GoBackIcon from 'img/v2/back-icon.svg'
import BlockIcon from 'img/v2/block-icon.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'
import LeaderboardIcon from 'img/v2/leaderboard-icon.svg'
import LinkIcon from 'img/v2/link-icon.svg'
import ShareIcon from 'img/v2/share-icon.svg'
import SolanaLogo from 'img/v2/solana-logo.svg'
import { find, get, isEmpty, isString } from 'lodash'
import Button from 'options/components/Button'
import NavBar from 'options/components/NavBar'
import NFTMedia from 'options/components/NFTMedia'
import ToolTip from 'options/components/ToolTip'
import { GalleryContext } from 'options/galleryContext'
import formatDatetime from 'options/utils/formatDatetime'
import formatNumber from 'options/utils/formatNumber'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as request } from 'services/request/popup'
import storage from 'services/storage'

import ShareNFTModal from './ShareNFTModal'
import ToggleButton from './ToggleButton'

const NFTDetail = () => {
  const history = useHistory()
  const { id } = useParams()
  const assets = useSelector((state) => state.assets)

  const [ownerImported, setOwnerImported] = useState(true)
  const [nft, setNft] = useState({})
  const [showShareNFTModal, setShowShareNFTModal] = useState(false)
  const [privateNFT, setPrivateNFT] = useState(false)
  const [isPendingUpdate, setIsPendingUpdate] = useState(false)
  const [nftLoaded, setNFTLoaded] = useState(false)

  const { setShowExportModal, handleShareNFT, showViews, showEarnedKoi } = useContext(
    GalleryContext
  )

  useEffect(() => {
    const loadPendingUpdate = async () => {
      const owner = nft.address
      const account = await popupAccount.getAccount({ address: owner })
      const pendingTransactions = await account.get.pendingTransactions()

      pendingTransactions?.every((pendingTransaction) => {
        const transactionId = get(pendingTransaction, 'data.txId')
        if (transactionId === nft.txId) {
          setIsPendingUpdate(transactionId === nft.txId)
          return false
        }
        return true
      })
    }

    if (!isEmpty(nft)) loadPendingUpdate()
  }, [nft, privateNFT])

  useEffect(() => {
    const getNft = async () => {
      let nft = find(assets.nfts, { txId: id })

      if (isEmpty(nft)) {
        nft = find(assets.collectionNfts, { txId: id })
        setOwnerImported(false)
      } else {
        setOwnerImported(true)
      }

      if (nft?.type === TYPE.SOLANA) {
        const solanaProvider = await storage.setting.get.solanaProvider()
        nft.provider = solanaProvider
      }

      setNft(nft)
      isString(nft?.isPrivate) ? setPrivateNFT(false) : setPrivateNFT(nft?.isPrivate)

      setNFTLoaded(true)
    }

    if (assets && isEmpty(nft)) getNft()
  }, [assets])

  const isArweaveNft = useMemo(() => {
    return nft?.type === TYPE.ARWEAVE
  }, [nft])

  const disabledFeatures = useMemo(() => {
    return nft?.isBridging || nft?.isSending || nft?.type === TYPE.K2
  }, [nft])

  const handleGoBack = () => {
    if (history.action === 'POP') history.push('/')
    else history.goBack()
  }

  const handleUpdateNft = async (input) => {
    try {
      await request.gallery.updateNft({ address: nft.address, txId: nft.txId, ...input })
    } catch (err) {
      // TODO handle setPrivateNFT
      console.error(err.message)
    }
  }

  const nftTooltipMessage = useMemo(() => {
    if (nft?.pending) return 'Transaction pending'
    if (isPendingUpdate) return 'Pending update'
    else
      return 'When set to public, this NFT <br>will show up in your DID gallery <br>and on the Koii Leaderboard.'
  }, [isPendingUpdate, nft])

  return (
    <div className="min-full min-h-screen h-full bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800">
      <NavBar />
      {nft && nftLoaded && (
        <div className="flex flex-col h-full w-full text-white">
          <div className="mx-auto mt-28 flex md:flex-col lg:flex-row">
            <div
              onClick={handleGoBack}
              className={clsx(
                'w-11 xl:w-12 2xl:w-13 3xl:w-14 h-11 xl:h-12 2xl:h-13 3xl:h-14',
                'absolute top-44 xl: 2xl: 3xl:top-47.25 left-12 lg:left-16 xl:left-32 2xl:left-40 3xl:left-56 4xl:left-68 cursor-pointer'
              )}
            >
              <GoBackIcon />
            </div>
            <div>
              <div
                className={clsx(
                  'w-100 xl:w-108 2xl:w-116 3xl:w-124 h-100 xl:h-108 2xl:h-116 3xl:h-124',
                  'mr-10 xl:mr-16 2xl:mr-24 3xl:mr-32 relative'
                )}
              >
                <NFTMedia contentType={nft.contentType} source={nft.imageUrl} showFull={true} />
                {nft?.type === TYPE.ETHEREUM && (
                  <EthLogo className="absolute bottom-2 right-2 w-9 shadow rounded-full" />
                )}
                {nft?.type === TYPE.ARWEAVE && (
                  <ArweaveLogo className="absolute bottom-2 right-2 w-9 shadow rounded-full" />
                )}
                {nft?.type === TYPE.SOLANA && (
                  <SolanaLogo className="absolute bottom-2 right-2 w-9 shadow rounded-full" />
                )}
              </div>
              {nft.type === TYPE.ARWEAVE && !nft.pending && (
                <div className="w-100 xl:w-108 2xl: 3xl:w-120 flex justify-between items-center h-17.25 xl: 2xl: 3xl:h-20 mt-6.5 mb-4 tracking-finnieSpacing-tight text-lg xl: 2xl: 3xl:text-xl text-center">
                  {showEarnedKoi && (
                    <div className="w-48.5 xl: 2xl: 3xl:w-55.5 h-full rounded bg-trueGray-100 bg-opacity-20 flex items-center justify-center">
                      KOII earned <br />
                      {formatNumber(nft.earnedKoi, 3)}
                    </div>
                  )}
                  {showViews && (
                    <div className="w-46 xl: 2xl: 3xl:w-52 h-full ml-5.75 xl: 2xl: 3xl:ml-12 rounded bg-trueGray-100 bg-opacity-20 flex items-center justify-center">
                      Total Views <br />
                      {nft.totalViews}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-108 h-100 xl: 2xl: 3xl:w-120 xl: 2xl: 3xl:h-120 relative">
              <div className="finnieSpacing-tighter font-semibold text-5xl xl: 2xl: 3xl:text-6xl mb-2">
                {nft.name}
              </div>
              {nft?.type !== TYPE.SOLANA && (
                <div className="flex items-center text-sm xl: 2xl: 3xl:text-base mb-2">
                  <div
                    className="h-6 mr-2.25"
                    data-tip={
                      isString(nft?.isPrivate)
                        ? 'The public/private feature <br>does not currently support this NFT. <br>Try the public/private feature with <br>a more recent NFT.'
                        : nftTooltipMessage
                    }
                  >
                    {/* <ToggleButton
                    value={privateNFT}
                    setValue={setPrivateNFT}
                    disabled={isString(nft?.isPrivate) || isPendingUpdate || nft?.pending}
                    handleUpdateNft={handleUpdateNft}
                  /> */}
                  </div>
                  {`Registered: ${formatDatetime(nft.createdAt)}`}
                </div>
              )}

              {nft?.type === TYPE.SOLANA && (
                <div className="flex gap-4 mb-4">
                  <a
                    // href={`https://solscan.io/tx/${nft.txId}?cluster=${nft.provider}`}
                    href={`https://solscan.io/token/${nft.txId}?cluster=${nft.provider}`}
                    target="_blank"
                  >
                    <Button
                      icon={BlockIcon}
                      text={'Explore Block'}
                      variant="inversed"
                      className="border-opacity-20 h-9.5 xl: 2xl: 3xl:h-12"
                    />
                  </a>
                </div>
              )}

              {nft?.type === TYPE.ETHEREUM && (
                <div className="flex gap-4 mb-4">
                  <a href={nft.koiRockUrl} target="_blank">
                    <Button
                      icon={BlockIcon}
                      text={'Explore Block'}
                      variant="inversed"
                      className="border-opacity-20 h-9.5 xl: 2xl: 3xl:h-12"
                    />
                  </a>
                </div>
              )}

              {nft?.type === TYPE.ARWEAVE && (
                <div className="flex gap-4 mb-4">
                  <a href={`https://viewblock.io/arweave/tx/${nft.txId}`} target="_blank">
                    <Button
                      disabled={disabledFeatures || nft.pending}
                      icon={BlockIcon}
                      text={nft.pending ? 'Pending Transaction' : 'Explore Block'}
                      variant="inversed"
                      className="border-opacity-20  h-9.5 xl: 2xl: 3xl:h-12"
                    />
                  </a>
                  <a href={`https://koi.rocks/content-details/${nft.txId}`} target="_blank">
                    <Button
                      disabled={disabledFeatures}
                      icon={LeaderboardIcon}
                      text="Leaderboard"
                      variant="warning"
                      className="h-9.5 xl: 2xl: 3xl:h-12"
                    />
                  </a>
                </div>
              )}

              <p
                className="w-full overflow-y-scroll overflow-x-none break-words text-sm xl: 2xl: 3xl:text-base leading-6 pr-4 whitespace-pre-line"
                style={{ maxHeight: '35%' }}
              >
                {nft.description}
              </p>
              <div className="mt-3.25 flex flex-wrap gap-x-2.5 gap-y-1 max-h-11 overflow-y-scroll">
                {nft.tags &&
                  nft.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center justify-center bg-lightBlue text-indigo tracking-finnieSpacing-wide text-xs xl: 2xl: 3xl:text-sm rounded-full h-5 py-0.5 px-3"
                    >
                      {tag}
                    </div>
                  ))}
              </div>

              {nft?.type !== TYPE.K2 && (
                <div className="w-full mt-7.5">
                  {!nft.pending && (
                    <div className="w-full flex items-center justify-between h-11.5 xl: 2xl: 3xl:h-14 gap-5 mb-6">
                      {nft?.type === TYPE.ARWEAVE && (
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
                      )}
                      <div
                        data-tip={
                          !ownerImported
                            ? `This NFT is owned by a wallet with the address ${nft.address}.<br>
                      Please import this wallet and continue to transfer NFT.`
                            : ''
                        }
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
                      className="h-11.5 xl: 2xl: 3xl:h-14 w-full"
                      data-tip={
                        !ownerImported
                          ? `This NFT is owned by a wallet with the address ${nft.address}.<br>
                    Please import this wallet and continue to bridge NFT.`
                          : ''
                      }
                    >
                      {nft.type === TYPE.ARWEAVE && (
                        <Button
                          size="lg"
                          icon={isArweaveNft ? EthLogo : ArweaveLogo}
                          variant="lightBlue"
                          text="Bridge your NFT to a different Blockchain"
                          onClick={() => setShowExportModal(nft)}
                          disabled={!ownerImported}
                          className="w-full h-full"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
              <ToolTip />
            </div>
          </div>
        </div>
      )}
      {showShareNFTModal && <ShareNFTModal txId={id} close={() => setShowShareNFTModal(false)} />}
    </div>
  )
}

export default NFTDetail
