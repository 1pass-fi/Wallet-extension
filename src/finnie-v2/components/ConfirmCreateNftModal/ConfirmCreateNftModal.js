import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuid } from 'uuid'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import BackIcon from 'img/v2/back-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-blue.svg'
import CrossIcon from 'img/v2/cross-icon-white.svg'
import ModalBackground from 'img/v2/modal-background.svg'

import TwitterIcon from 'img/v2/share-modal-icons/twitter-icon.svg'
import FacebookIcon from 'img/v2/share-modal-icons/facebook-icon.svg'
import LinkedIn from 'img/v2/share-modal-icons/linkedin-icon.svg'
import MailIcon from 'img/v2/share-modal-icons/mail-icon.svg'
import EmbedIcon from 'img/v2/share-modal-icons/embed-icon.svg'
import ShareIcon from 'img/v2/share-modal-icons/share-icon.svg'

import NFTMedia from 'finnie-v2/components/NFTMedia'
import Button from 'finnie-v2/components/Button'
import { GalleryContext } from 'options/galleryContext'

import formatLongString, { formatLongStringTruncate } from 'finnie-v2/utils/formatLongString'
import formatNumber from 'finnie-v2/utils/formatNumber'
import shareSocialNetwork from 'finnie-v2/utils/shareSocialNetwork'

import { SOCIAL_NETWORKS } from 'constants/koiConstants'

import storage from 'services/storage'
import arweave from 'services/arweave'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

const ConfirmCreateNftModal = ({ nftContent, tags, fileType, url, close, resetState }) => {
  const estimateCostKOII = 1

  const { setError, setIsLoading, handleShareNFT, refreshNFTs } = useContext(GalleryContext)

  const [step, setStep] = useState(1)
  const [estimateCostAr, setEstimateCostAr] = useState(0)
  const [disableCreateNFT, setDisableCreateNFT] = useState(false)
  const [nftId, setNftId] = useState(null)
  const [showShareLink, setShowShareLink] = useState(true)

  const modalRef = useRef(null)

  const defaultAccount = useSelector((state) => state.defaultAccount)

  const handleUploadNFT = async () => {
    try {
      // set isLoading
      setDisableCreateNFT(true)
      setIsLoading((prev) => ++prev)

      const response = await fetch(url)
      const blob = await response.blob()
      const dataBuffer = await blob.arrayBuffer()

      let u8 = new Int8Array(dataBuffer)
      u8 = JSON.stringify(u8, null, 2)

      const imageId = uuid()

      await storage.generic.set.nftBitData({ bitObject: u8, imageId })

      const content = {
        title: nftContent.title,
        owner: nftContent.owner,
        description: nftContent.description,
        isNSFW: nftContent.isNSFW
      }

      const { txId } = await backgroundRequest.gallery.uploadNFT({
        content,
        tags,
        fileType,
        address: defaultAccount.address,
        price: estimateCostAr, 
        imageId
      })

      if (txId) setStep(2); setNftId(txId); refreshNFTs(); resetState()
      // set isLoading
      setIsLoading((prev) => --prev)
      setDisableCreateNFT(false)
    } catch (err) {
      console.error(err.message)
      // set Error
      setError(err.message)
      setIsLoading((prev) => --prev)
      setDisableCreateNFT(false)
    }
  }

  useEffect(() => {
    const getPrice = async () => {
      const response = await fetch(url)
      const blob = await response.blob()
      const length = await (await blob.arrayBuffer()).byteLength

      const arPrice = await arweave.transactions.getPrice(length)
      setEstimateCostAr(arweave.ar.winstonToAr(arPrice))
    }

    getPrice()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalRef])

  const shareLink = useMemo(() => {
    return `https://koii.live/${nftId}.html`
  }, [nftId])

  const embedLink = useMemo(() => {
    return `https://koi.rocks/embed/${nftId}" title="Koii NFT image" frameborder="0" allowfullscreen></iframe>`
  }, [nftId])

  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-screen bg-black bg-opacity-25 fixed z-51 top-0 left-0">
      <div
        className="w-146.5 h-98 rounded bg-trueGray-100 flex flex-col items-center text-indigo"
        ref={modalRef}
      >
        <div className="flex h-16.75 rounded-t bg-trueGray-100 shadow-md w-full font-semibold text-xl tracking-finnieSpacing-wide relative">
          {step === 1 && (
            <BackIcon onClick={close} className="w-7 h-7 top-4 left-4 absolute cursor-pointer" />
          )}
          {step === 1 && <div className="m-auto">Create Your Atomic NFT</div>}
          {step === 2 && <div className="m-auto">You just made a new NFT!</div>}
          {step === 3 && <div className="m-auto">Share to earn Attention Rewards</div>}

          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>
        {step === 1 && (
          <>
            <div className="mt-4.25 w-115 text-sm tracking-finnieSpacing-tight text-center">
              Atomic NFTs are stored permanently on Arweave. With Koii, they earn attention rewards
              forever.
            </div>
            <div className="flex w-108 mt-4.25 justify-evenly">
              <div className="w-40 h-40 object-cover rounded">
                <NFTMedia contentType={fileType} source={url} />
              </div>

              <div className="flex flex-col pl-6 w-68">
                <div className="font-semibold text-base tracking-finnieSpacing-wide leading-6">
                  {formatLongStringTruncate(nftContent.title, 35)}
                </div>
                <div className="text-sm tracking-finnieSpacing-tight leading-5">
                  {formatLongStringTruncate(nftContent.description, 32)}
                </div>
                <div className="h-4 w-full flex flex-wrap gap-1 overflow-y-scroll">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="max-h-3.75 flex justify-evenly items-center rounded-full bg-blue-800 text-white text-2xs py-0.5 px-1.5 cursor-pointer"
                    >
                      <CrossIcon className="mr-0.5 w-1.75 h-1.75" />
                      {formatLongString(tag, 25)}
                    </div>
                  ))}
                </div>
                <div className="font-semibold text-base tracking-finnieSpacing-wide leading-6 mt-3">
                  Estimated Costs:
                </div>
                <div className="finnieSpacing-wider text-sm leading-5">{estimateCostKOII} KOII</div>
                <div className="finnieSpacing-wider text-sm leading-5">
                  {formatNumber(estimateCostAr, 6)} AR <span className="text-2xs text-success-700">Storage Fee</span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleUploadNFT}
              className="h-9 mt-8 font-semibold text-sm rounded w-43.75"
              variant="indigo"
              text="Create NFT"
              disabled={disableCreateNFT}
            />
          </>
        )}
        {step === 2 && (
          <div className="relative w-full h-full">
            <ModalBackground className="absolute top-0 left-0" />
            <div className="ml-56 mt-27">
              <div className="font-semibold text-xl tracking-finnieSpacing-wide">
                Your NFT is being created!
              </div>
              <div className="text-base">
                It will take a few minutes to reflect on your wallet. In the meantime...
              </div>
            </div>
            <div className='flex w-101 justify-between m-auto'>
              <Button
                onClick={() => {close(); handleShareNFT(nftId)}}
                className="h-10 mt-16 font-semibold text-base rounded w-43.75 mx-auto"
                variant="indigo"
                text="Transfer"
              />
              <Button
                onClick={() => setStep(3)}
                className="h-10 mt-16 font-semibold text-base rounded w-43.75 mx-auto"
                variant="inversedIndigo"
                text="Share"
              />              
            </div>
          </div>
        )}
        {
          step === 3 && (
            <div className="relative w-full h-full text-center">
              <div className='w-112 text-sm mt-6'>
                  Earn attention rewards for ever through Koii. Copy this link and share on your favorite social platforms:
              </div>
              <div className='mt-6 text-base font-semibold'>
                {showShareLink ? 'Share Link' : 'Embed Link'}
              </div>
              {showShareLink && <input type='text' value={shareLink} disabled className='w-94.5 m-auto mt-2 rounded-1 text-sm leading-6 text-blue-800 border-1.5 border-solid border-blue-800 px-1' />}
              {!showShareLink && <textarea value={embedLink} disabled className='w-94.5 h-20 m-auto mt-2 rounded-1 text-sm leading-6 text-blue-800 border-1.5 border-solid border-blue-800 px-1' />}
              <CopyToClipboard text={showShareLink ? shareLink : embedLink}>
                <Button
                  className="h-10 mt-5 font-semibold text-base rounded w-43.75 mx-auto"
                  variant="indigo"
                  text="Copy link"
                />
              </CopyToClipboard>
              <div className='flex w-77.25 m-auto mt-5 justify-between'>
                <div className='cursor-pointer' onClick={() => shareSocialNetwork(SOCIAL_NETWORKS.TWITTER, nftId)}><TwitterIcon /></div>
                <div className='cursor-pointer' onClick={() => shareSocialNetwork(SOCIAL_NETWORKS.FACEBOOK, nftId)}><FacebookIcon /></div>
                <div className='cursor-pointer' onClick={() => shareSocialNetwork(SOCIAL_NETWORKS.LINKEDIN, nftId)}><LinkedIn /></div>
                <div className='cursor-pointer'><MailIcon /></div>
                <div onClick={() => setShowShareLink(prev => !prev)} className='cursor-pointer'>{showShareLink ? <EmbedIcon /> : <ShareIcon />}</div>
              </div>
            </div>
          )
        } 
      </div>
    </div>
  )
}

export default ConfirmCreateNftModal
