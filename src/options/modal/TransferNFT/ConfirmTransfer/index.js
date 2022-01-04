import React from 'react'

import WarningIcon from 'img/v2/warning-icon.svg'
import EditIcon from 'img/v2/edit-icon-gray.svg'
import './index.css'

const ConfirmTransfer = ({ receiverAddress, goBack }) => {
  return (
    <div className="confirm-transfer">
      <div className="label">Receiver's Wallet Address:</div>

      <div className="receiver-field">
        <div className="receiver-address">{receiverAddress}</div>
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
