import React from 'react'
import WarningIcon from 'img/v2/warning-icon.svg'

import './index.css'

const TransferFrom = ({
  receiverAddress,
  setReceiverAddress,
  numberToTransfer,
  setNumberToTransfer
}) => {
  return (
    <div className="transfer-form">
      <div className="receiver-address">
        <label className="label">Receiver’s Wallet Address:</label>
        <input
          type="text"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          name="receiver-address-input"
        />
        <div className="warning">
          <div className="warning-icon">
            <WarningIcon />
          </div>
          <div className="warning-text">
            Make sure this is the correct address. This action cannot be undone.
          </div>
        </div>
      </div>

      <div className="number-to-transfer">
        <label className="label">Number to transfer:</label>
        <div className="total-available">total available:&nbsp; {1}</div>
        <input
          type="number"
          min={1}
          step={1}
          max={1}
          value={numberToTransfer}
          onChange={(e) => setNumberToTransfer(e.target.value)}
          disabled={true}
          name="nft-amount-input"
        />
        <div className="description">Many NFTs will only have 1 item minted.</div>
      </div>
    </div>
  )
}

export default TransferFrom
