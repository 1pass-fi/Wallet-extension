import React from 'react'
import PropTypes from 'prop-types'

import Modal from '..'
import Button from 'popup/shared/button/'

import './index.css'

const propTypes = {
  accountName: PropTypes.string,
  accountID: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
}

const ModalTitle = ({ accountName }) => {
  return (
    <div className='modal-title'>
      Are you sure you want to remove
      <br />
      <strong>{accountName}</strong>
      from your Koi Wallet?
    </div>
  )
}

const RemoveAccountModal = ({ accountName, accountID, onClose, onSubmit }) => {
  return (
    <Modal onClose={onClose} >
      <ModalTitle accountName={accountName} />
      <div className="modal-account-id">{accountID}</div>
      <div className="modal-description">
        To access to this wallet again from Koi, you will need to add it as a new account.
      </div>
      <div className="modal-action-buttons">
        <Button
          onClick={onSubmit}
          type="outline"
          label="Yes, Remove"
          className="modal-action-button remove"
        />
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

RemoveAccountModal.propTypes = propTypes

export default RemoveAccountModal
