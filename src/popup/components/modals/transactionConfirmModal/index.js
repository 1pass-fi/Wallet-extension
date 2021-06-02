import React from 'react'
import PropTypes from 'prop-types'

import Modal from 'popup/components/shared/modal/index'
import Button from 'popup/components/shared/button/'

import './index.css'

const propTypes = {
  sentAmount: PropTypes.number,
  accountAddress: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
}

const ModalTitle = ({ amount, currency }) => {
  return (
    <div className="modal-title">
      <strong>Transaction Confirmation</strong> 
      <br />
      Send{' '}
      <strong>{new Intl.NumberFormat('en-US').format(amount)} {currency}</strong> to
    </div>
  )
}

const TransactionConfirmModal = ({
  sentAmount,
  accountAddress,
  currency,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal onClose={onClose} className='transaction-modal'>
      <ModalTitle amount={sentAmount} currency={currency}/>
      <div className="modal-account-address confirm-transaction">{accountAddress}</div>
      <div className="modal-description">
        * Yes, I have confirmed this is the correct wallet address.
      </div>
      <div className="modal-action-buttons">
        <Button
          onClick={onSubmit}
          label={`Send ${currency}`}
          className="modal-action-button send"
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

TransactionConfirmModal.propTypes = propTypes

export default TransactionConfirmModal
