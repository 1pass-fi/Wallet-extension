// modules
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

// components
import Modal from 'popup/components/shared/modal/index'
import Button from 'popup/components/shared/button/'

// utils
import { numberFormat, calculateGasFee } from 'utils'

// styles
import './index.css'
import { popupAccount } from 'services/account'

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
      <strong>{numberFormat(amount)} {currency}</strong> to
    </div>
  )
}

const TransactionConfirmModal = ({
  sentAmount,
  accountAddress,
  currency,
  onClose,
  onSubmit,
  selectedAccount
}) => {
  const [gasFee, setGasFee] = useState(0)

  useEffect(() => {
    const loadGasFee = async () => {
      const account = await popupAccount.getAccount({ address: selectedAccount.address })
      const provider = await account.get.provider()

      const gasFee = await calculateGasFee({ 
        amount: sentAmount, 
        senderAddress: selectedAccount.address,
        toAddress: accountAddress,
        provider: provider
      })

      setGasFee(gasFee)
    }

    loadGasFee()
  }, [])

  return (
    <Modal onClose={onClose} className='transaction-modal'>
      <ModalTitle amount={sentAmount} currency={currency}/>
      <div className="modal-account-address confirm-transaction">{accountAddress}</div>
      {gasFee && <div>Gas fee {gasFee} ETH</div>}
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
