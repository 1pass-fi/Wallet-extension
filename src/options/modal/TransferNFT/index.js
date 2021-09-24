import React, { useState } from 'react'

import Modal from 'options/shared/modal'
import TransferFrom from './TransferForm'

import './index.css'

const TransferNFT = ({
  txid,
  ownerName,
  name,
  imageUrl,
  earnedKoi,
  totalViews,
}) => {
  const [receiverAddress, setReceiverAddress] = useState('')
  const [numberToTransfer, setNumberToTransfer] = useState(1)

  return (
    <div className="transfer-nft wrapper">
      <div className="title">
        Transfer <span className="title__asset-name">{name}</span> to a friend.
      </div>

      <div className="transfer-nft container">
        <div className="asset-info">
          <img src={imageUrl} alt={name}></img>
          <div className="asset-name">{name}</div>
          <div className="asset-owner">{ownerName}</div>
          <div className="asset-total-views">{totalViews} views</div>
          <div className="asset-koii-earned">{earnedKoi} KOII earned</div>
        </div>

        <div className="right-side">
          <TransferFrom
            receiverAddress={receiverAddress}
            setReceiverAddress={setReceiverAddress}
            numberToTransfer={numberToTransfer}
            setNumberToTransfer={setNumberToTransfer}
          />
        </div>
      </div>
    </div>
  )
}

export default ({
  onClose,
  ownerName,
  txid,
  name,
  imageUrl,
  earnedKoi,
  totalViews,
}) => {
  return (
    <div>
      <Modal onClose={onClose}>
        <TransferNFT
          txid={txid}
          name={name}
          ownerName={ownerName}
          imageUrl={imageUrl}
          earnedKoi={earnedKoi}
          totalViews={totalViews}
        />
      </Modal>
    </div>
  )
}
