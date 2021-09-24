import React, { useContext, useState } from 'react'

import Modal from 'options/shared/modal'
import TransferFrom from './TransferForm'
import ConfirmTransfer from './ConfirmTransfer'
import TransferSuccess from './TransferSuccess'

import { GalleryContext } from 'options/galleryContext'
import { formatNumber } from 'options/utils'
import { popupBackgroundRequest } from 'services/request/popup'

import './index.css'

const TransferNFT = ({
  txId,
  name,
  imageUrl,
  earnedKoi,
  totalViews,
  contentType,
  address,
  onClose,
}) => {
  const { setError } = useContext(GalleryContext)

  const [stage, setStage] = useState(1)
  const [receiverAddress, setReceiverAddress] = useState('')
  const [numberToTransfer, setNumberToTransfer] = useState(1)
  const [sendBtnDisable, setSendBtnDisable] = useState(false)

  const goToNextStage = () => setStage((stage) => stage + 1)

  const handleTransferNFT = async () => {
    try {
      setSendBtnDisable(true)
      const res = await popupBackgroundRequest.gallery._transferNFT({
        nftId: txId,
        senderAddress: address,
        recipientAddress: receiverAddress,
      })

      setSendBtnDisable(false)
      goToNextStage()
    } catch (error) {
      setSendBtnDisable(false)
      setError('Whoops! Something went wrong!')
    }
  }

  return (
    <div className="transfer-nft wrapper">
      <div className="title">
        {stage === 1 && (
          <>
            Transfer <span className="title__asset-name">{name}</span> to a
            friend.
          </>
        )}

        {stage === 2 && <>Confirm your Transfer</>}
        {stage === 3 && <>The NFT is on its way!</>}
      </div>

      <div className="transfer-nft container">
        <div className="asset-info">
          {(contentType.includes('image') ||
            contentType.includes('svg+xml')) && (
            <img src={imageUrl} className="nft-img" />
          )}
          {contentType.includes('video') && (
            <video
              width={320}
              height={240}
              src={imageUrl}
              className="nft-img"
              controls
              autoPlay
            />
          )}
          {contentType.includes('html') && (
            <div className="nft-img-iframe">
              <div className="iframe-wrapper">
                <iframe frameBorder="0" src={imageUrl} />
              </div>
            </div>
          )}
          <div className="asset-name">{name}</div>
          {/* <div className="asset-owner">{ownerName}</div> */}
          <div className="asset-total-views">{totalViews} views</div>
          <div className="asset-koii-earned">
            {formatNumber(earnedKoi)} KOII earned
          </div>
        </div>

        <div className="right-side">
          {stage === 1 && (
            <TransferFrom
              receiverAddress={receiverAddress}
              setReceiverAddress={setReceiverAddress}
              numberToTransfer={numberToTransfer}
              setNumberToTransfer={setNumberToTransfer}
              handleBtnClick={goToNextStage}
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
              name={name}
              receiverAddress={receiverAddress}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ({
  onClose,
  cardInfo: {
    txId,
    name,
    imageUrl,
    earnedKoi,
    totalViews,
    contentType,
    address,
  },
}) => {
  let validName = name
  if (name.length > 14){
    validName = name.slice(0,12) + '...'
  }

  return (
    <div>
      <Modal onClose={onClose}>
        <TransferNFT
          txId={txId}
          name={validName}
          imageUrl={imageUrl}
          earnedKoi={earnedKoi}
          totalViews={totalViews}
          contentType={contentType}
          address={address}
          onClose={onClose}
        />
      </Modal>
    </div>
  )
}
