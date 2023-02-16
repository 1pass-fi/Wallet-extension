import React from 'react'
import { connect } from 'react-redux'
// actions
import { setError } from 'actions/error'
import { setIsLoading } from 'actions/loading'
// components
import Button from 'popup/components/shared/button/'
import Modal from 'popup/components/shared/modal/index'
// service
import { popupBackgroundRequest as request } from 'services/request/popup'

// styles
import './index.css'

const ExpiredTxModal = ({ onClose, txInfo, setError, setPendingTransactions, setIsLoading }) => {
  const expiredTxAction = async (txInfo, wantToResend) => {
    try {
      console.log('txInfo', txInfo)
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

            if (txInfo.activityName === 'Initialized DID Data' &&
              transaction.address === txInfo.address &&
              transaction.activityName === 'Created DID'
            ) {
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
      setError(err.message)
      onClose()
    }
  }

  return (
    <Modal onClose={onClose} className="expired-transaction-modal">
      <div className="modal-title">
        <strong>Take an action</strong>
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
