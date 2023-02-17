import React from 'react'
import CheckIcon from 'img/v2/green-tick-icon.svg'

import './index.css'

const TransferSuccess = ({ receiverAddress, name, onClose }) => {
  return (
    <div className="transfer-success">
      <div className="successfully-sent">
        <div className="green-tick">
          <CheckIcon />
        </div>
        <div>{chrome.i18n.getMessage('SuccessfullySent')}</div>
      </div>
      <div className="label">{chrome.i18n.getMessage('ReceiverWalletAddress')}:</div>
      <div className="receiver-address">{receiverAddress}</div>
    </div>
  )
}

export default TransferSuccess
