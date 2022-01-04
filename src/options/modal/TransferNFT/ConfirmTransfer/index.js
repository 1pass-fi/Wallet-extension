import React from 'react'

import WarningIcon from 'img/warning-icon-outline.svg'
import EditIcon from 'img/edit-icon-collection.svg'
import './index.css'

const ConfirmTransfer = ({ receiverAddress, goBack }) => {
  return (
    <div className="confirm-transfer">
      <div className="label">Receiver's Wallet Address:</div>

      <div className="receiver-field">
        <div className="receiver-address">
          {receiverAddress.length > 24
            ? `${receiverAddress.slice(0, 20)}...${receiverAddress.slice(
              receiverAddress.length - 4
            )}`
            : receiverAddress}
        </div>
        <div className="edit-icon" onClick={goBack}>
          <EditIcon />
        </div>
      </div>

      <div className="warning">
        <div className="warning-icon">
          <WarningIcon />
        </div>
        <div className="warning-text">
          Transfer of ownership can take up to 10 minutes after you confirm the purchase.
        </div>
      </div>
    </div>
  )
}

export default ConfirmTransfer
