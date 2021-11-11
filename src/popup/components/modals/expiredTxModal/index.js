import React from 'react'
import { connect } from 'react-redux'

// components
import Button from 'popup/components/shared/button/'
import Modal from 'popup/components/shared/modal/index'

// service
import { popupBackgroundRequest as request } from 'services/request/popup'

// actions
import { setError } from 'actions/error'
import { setIsLoading } from 'actions/loading'

// constants
import { ERROR_MESSAGE } from 'constants/koiConstants'

// styles
import './index.css'

const ExpiredTxModal = ({ onClose, txInfo, setError, setPendingTransactions, setIsLoading }) => {
  const expiredTxAction = async (txInfo, wantToResend) => {
    try {
      setIsLoading(true)
      const resentTransactionId = await request.wallet.handleExpiredTransaction({...txInfo, wantToResend})
      /* 
        Resent: resentTransactionId !== null
        Deleted: resentTransactionId === null
      */
      if (resentTransactionId) {
        setPendingTransactions(prev => {
          return prev.map(transaction => {
            if (transaction.id === txInfo.txId) {
              transaction.expired = false
              transaction.id = resentTransactionId
            }
            return transaction
          })
        })
      } else {
        setPendingTransactions(prev => prev.filter(transaction => transaction.id !== txInfo.txId))
      }
      setIsLoading(false)
      onClose()
    } catch (err) {
      console.log(err.message)
      setIsLoading(false)
      setError(ERROR_MESSAGE.EXPIRED_TRANSACTION_ACTION_ERROR)
      onClose()
    }
  }

  return (
    <Modal onClose={onClose} className="expired-transaction-modal">
      <div className="modal-title">
        <strong>Delete this transaction</strong>
      </div>
      <div className="modal-description">
        Do you want to delete or resend the transaction?
      </div>
      <div className="modal-action-buttons">
        <Button label="Delete" className="modal-action-button delete" onClick={() => expiredTxAction(txInfo, false)} />
        <Button
          onClick={() => expiredTxAction(txInfo, true)}
          type="outline"
          label="Resend"
          className="modal-action-button close"
        />
      </div>
    </Modal>
  )
}

export default connect(null, { setError, setIsLoading })(ExpiredTxModal)
