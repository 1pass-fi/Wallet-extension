import React, { useContext, useState, useRef, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import TransferFrom from './TransferForm'
import ConfirmTransfer from './ConfirmTransfer'
import TransferSuccess from './TransferSuccess'

import { GalleryContext } from 'options/galleryContext'
import { formatNumber } from 'options/utils'
import { popupBackgroundRequest } from 'services/request/popup'

import './index.css'
import { setAssets } from 'options/actions/assets'

import { isArweaveAddress } from 'utils'

// v2
import { formatLongStringTruncate } from 'finnie-v2/utils/formatLongString'
import NFTMedia from 'finnie-v2/components/NFTMedia'

import CloseIcon from 'img/v2/close-icon-blue.svg'
import BackIcon from 'img/v2/back-icon-blue.svg'

const TransferNFT = ({
  onClose,
  cardInfo: { txId, name, imageUrl, earnedKoi, totalViews, contentType, address }
}) => {
  const formattedName = useMemo(() => formatLongStringTruncate(name, 50), name)
  const { setError } = useContext(GalleryContext)

  const modalRef = useRef(null)

  const [stage, setStage] = useState(1)
  const [receiverAddress, setReceiverAddress] = useState('')
  const [numberToTransfer, setNumberToTransfer] = useState(1)
  const [sendBtnDisable, setSendBtnDisable] = useState(false)

  const assets = useSelector((state) => state.assets)
  const dispatch = useDispatch()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalRef])

  const goToNextStage = () => setStage((stage) => stage + 1)

  const handleValidateArAddress = () => {
    const isValid = isArweaveAddress(receiverAddress)
    if (!isValid) {
      setError('Invalid Wallet Address')
    } else {
      goToNextStage()
    }
  }

  const handleTransferNFT = async () => {
    try {
      setSendBtnDisable(true)
      const res = await popupBackgroundRequest.gallery._transferNFT({
        nftId: txId,
        senderAddress: address,
        recipientAddress: receiverAddress
      })

      // manually update nfts state
      const nfts = assets.nfts.map((nft) => {
        if (nft.txId === txId) nft.isSending = true
        return nft
      })
      dispatch(setAssets({ nfts }))

      setSendBtnDisable(false)
      goToNextStage()
    } catch (error) {
      setSendBtnDisable(false)
      setError('Whoops! Something went wrong!')
    }
  }

  return (
    <div className="new-modal-wrapper">
      <div className="transfer-nft wrapper" ref={modalRef}>
        <section className="new-modal-header">
          <BackIcon className="new-modal-header-icon" />
          <div className="title">
            {stage === 1 && <>Transfer your NFT to a friend</>}
            {stage === 2 && <>Confirm your Transfer</>}
            {stage === 3 && <>The NFT is on its way!</>}
          </div>
          <CloseIcon className="new-modal-header-icon" onClick={onClose} />
        </section>

        <div className="transfer-nft__nft-name">{formattedName}</div>

        <div className="transfer-nft container">
          <div className="media">
            <NFTMedia contentType={contentType} source={imageUrl} />
          </div>

          <div className="right-side">
            {stage === 1 && (
              <TransferFrom
                receiverAddress={receiverAddress}
                setReceiverAddress={setReceiverAddress}
                numberToTransfer={numberToTransfer}
                setNumberToTransfer={setNumberToTransfer}
                handleBtnClick={handleValidateArAddress}
              />
            )}
            {stage === 2 && (
              <ConfirmTransfer
                receiverAddress={receiverAddress}
                goBack={() => setStage(1)}
                handleBtnClick={async () => await handleTransferNFT()}
                sendBtnDisable={sendBtnDisable}
              />
            )}

            {stage === 3 && (
              <TransferSuccess
                name={formattedName}
                receiverAddress={receiverAddress}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferNFT
