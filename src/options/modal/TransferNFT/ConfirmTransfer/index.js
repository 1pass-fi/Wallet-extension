import React from 'react'
import EditIcon from 'img/v2/edit-icon-gray.svg'
import WarningIcon from 'img/v2/warning-icon.svg'

import './index.css'

const ConfirmTransfer = ({ receiverAddress, goBack }) => {
  return (
    <div className="confirm-transfer">
      <div className="label">{chrome.i18n.getMessage('receiverWalletAddress')}:</div>

      <div className="receiver-field">
        <div className="receiver-address" title="receiver-address">{receiverAddress}</div>
        <div className="edit-icon" onClick={goBack}>
          <EditIcon />
        </div>
      </div>

      <div className="warning">
        <div className="warning-icon">
          <WarningIcon />
        </div>
        <div className="warning-text">
          {' ' + chrome.i18n.getMessage('transferOwnershipTakeTime')}
        </div>
      </div>
    </div>
  )
}

export default ConfirmTransfer
