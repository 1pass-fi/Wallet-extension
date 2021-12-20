import React from 'react'
import isEmpty from 'lodash/isEmpty'

import StackIcon from 'img/stack-icon.svg'
import WarningIcon from 'img/warning-icon-outline.svg'
import './index.css'

const TransferFrom = ({
  receiverAddress,
  setReceiverAddress,
  numberToTransfer,
  setNumberToTransfer,
  handleBtnClick,
}) => {
  return (
    <div className="transfer-form">
      <div className="leading">Enter the Wallet Address of the receiver:</div>

      <div className="receiver-address">
        <label className="label">Wallet Address:</label>
        <input
          type="text"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
        />
        <div className="warning">
          <div className="warning-icon">
            <WarningIcon />
          </div>
          <div className="warning-text">
            Make sure this is the correct address. Once sent, there is no way to
            undo the transaction.
          </div>
        </div>
      </div>

      <div className="number-to-transfer">
        <label className="label">Number to transfer:</label>
        <div className="total-available">total available:&nbsp; {1}</div>
        <StackIcon className="input-logo" />
        <input
          type="number"
          min={1}
          step={1}
          max={1}
          value={numberToTransfer}
          onChange={(e) => setNumberToTransfer(e.target.value)}
          disabled={true}
        />
        {/* <div className="description">
          Many NFTs will only have 1 item minted. If this is the case for your
          transfer, this box will auto-fill.
        </div> */}
      </div>

      <button
        onClick={handleBtnClick}
        className="submit-btn"
        disabled={isEmpty(receiverAddress)}
      >
        Send My NFT
      </button>
    </div>
  )
}

export default TransferFrom
