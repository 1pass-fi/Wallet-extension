import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuid } from 'uuid'

import BackIcon from 'img/v2/back-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-blue.svg'
import CrossIcon from 'img/v2/cross-icon-white.svg'
import ModalBackground from 'img/v2/modal-background.svg'

import NFTMedia from 'finnie-v2/components/NFTMedia'
import Button from 'finnie-v2/components/Button'

import formatLongString, { formatLongStringTruncate } from 'finnie-v2/utils/formatLongString'
import { formatNumber } from 'options/utils'

import storage from 'services/storage'
import arweave from 'services/arweave'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

const ConfirmCreateNftModal = ({ nftContent, tags, fileType, url, close }) => {
  const [step, setStep] = useState(1)
  const [estimateCostKOII, setEstimateCostKOII] = useState(1)
  const [estimateCostAr, setEstimateCostAr] = useState(0)

  const modalRef = useRef(null)

  const defaultAccount = useSelector(state => state.defaultAccount)

  const handleUploadNFT = async () => {
    try {
      // set isLoading

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
  
      if (txId) setStep(2)
      // set isLoading
    } catch (err) {
      console.error(err.message)
      // set Error
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
              <div className="font-light text-base">
                It might take a moment to be reflected in your wallet.
              </div>
            </div>
            <Button
              onClick={close}
              className="h-10 mt-16 font-semibold text-sm rounded w-43.75 mx-auto"
              variant="indigo"
              text="OK"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ConfirmCreateNftModal
