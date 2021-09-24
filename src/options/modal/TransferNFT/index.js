import React, { useState } from 'react'

import Modal from 'options/shared/modal'
import TransferFrom from './TransferForm'
import ConfirmTransfer from './ConfirmTransfer'

import { formatNumber } from 'options/utils'

import './index.css'

const TransferNFT = ({
  txId,
  ownerName,
  name,
  imageUrl,
  earnedKoi,
  totalViews,
  contentType,
}) => {
  const [stage, setStage] = useState(1)

  const [receiverAddress, setReceiverAddress] = useState('')
  const [numberToTransfer, setNumberToTransfer] = useState(1)

  const handleBtnClick = () => setStage((stage) => stage + 1)

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
              handleBtnClick={handleBtnClick}
            />
          )}

          {stage === 2 && (
            <ConfirmTransfer
              receiverAddress={receiverAddress}
              goBack={() => setStage(1)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ({
  onClose,
  cardInfo: { txId, name, imageUrl, earnedKoi, totalViews, contentType },
}) => {
  return (
    <div>
      <Modal onClose={onClose}>
        <TransferNFT
          txId={txId}
          name={name}
          ownerName={'Kayla'}
          imageUrl={imageUrl}
          earnedKoi={earnedKoi}
          totalViews={totalViews}
          contentType={contentType}
        />
      </Modal>
    </div>
  )
}
