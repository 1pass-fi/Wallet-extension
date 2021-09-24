import React from 'react'
import { useHistory } from 'react-router-dom'

import WarningIcon from 'img/warning-icon-outline.svg'
import CheckIcon from 'img/green-tick.svg'
import './index.css'

const TransferSuccess = ({ receiverAddress, name, onClose }) => {
  const history = useHistory()

  const backToGallery = () => {
    onClose()
    history.push('/')
  }

  return (
    <div className="transfer-success">
      <div className="green-tick">
        <CheckIcon />
      </div>
      <div className="label">
        <span className="asset-name">{name}</span> has been sent successfully
        to:
      </div>
      <div className="receiver-field">
        <div className="receiver-address">
          {receiverAddress.length > 24
            ? `${receiverAddress.slice(0, 20)}...${receiverAddress.slice(
              receiverAddress.length - 4
            )}`
            : receiverAddress}
        </div>
      </div>

      <div className="warning">
        <div className="warning-icon">
          <WarningIcon />
        </div>
        <div className="warning-text">
          Transfer of ownership can take up to 10 minutes after you confirm the
          purchase.
        </div>
      </div>

      <button className="submit-btn" onClick={backToGallery}>
        Back To Gallery
      </button>
    </div>
  )
}

export default TransferSuccess
