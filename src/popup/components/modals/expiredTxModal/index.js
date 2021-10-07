import React from 'react'

// components
import Button from 'popup/components/shared/button/'
import Modal from 'popup/components/shared/modal/index'

// styles
import './index.css'

const ExpiredTxModal = ({ onClose, txInfo }) => {
  const handleDeleteTx = (txInfo) => {
    console.log({...txInfo, wantToResend: false})
  }
  return (
    <Modal onClose={onClose} className="expired-transaction-modal">
      <div className="modal-title">
        <strong>Delete this transaction</strong>
      </div>
      <div className="modal-description">
        Are you sure you want to delete this transaction?
      </div>
      <div className="modal-action-buttons">
        <Button label="Delete" className="modal-action-button delete" onClick={() => handleDeleteTx(txInfo)} />
        <Button
          onClick={onClose}
          type="outline"
          label="No, Go Back"
          className="modal-action-button close"
        />
      </div>
    </Modal>
  )
}

export default ExpiredTxModal
