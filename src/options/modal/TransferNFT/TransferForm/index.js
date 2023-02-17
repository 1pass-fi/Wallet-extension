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
        <label className="label">{chrome.i18n.getMessage('ReceiverWalletAddress')}:</label>
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
            {chrome.i18n.getMessage('MakeSureCorrectAddress')}
          </div>
        </div>
      </div>

      <div className="number-to-transfer">
        <label className="label">{chrome.i18n.getMessage('NumberToTransfer')}:</label>
        <div className="total-available">{chrome.i18n.getMessage('totalAvailable')}:&nbsp; {1}</div>
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
        <div className="description">{chrome.i18n.getMessage('NFTOnlyHave1ItemMinted')}</div>
      </div>
    </div>
  )
}

export default TransferFrom
