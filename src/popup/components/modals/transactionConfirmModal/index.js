// modules
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

// components
import Modal from 'popup/components/shared/modal/index'
import Button from 'popup/components/shared/button/'

// utils
import { numberFormat, calculateGasFee, winstonToAr } from 'utils'

// styles
import './index.css'
import { popupAccount } from 'services/account'

import arweave from 'services/arweave'
import { TYPE } from 'constants/accountConstants'

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
  selectedAccount,
}) => {
  const [gasFee, setGasFee] = useState(0)
  const [arFee, setArFee] = useState(0)

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

    const loadArFee = async () => {
      if (currency === 'AR') {
        const tx = await arweave.createTransaction({
          quantity: `${sentAmount * 1000000000000}`,
          target: accountAddress
        })

        const fee = await arweave.transactions.getPrice(0, accountAddress)

        setArFee(0.0008) // TODO: find for a proper way to get the exact ar fee
      }

      if (currency === 'KOII') setArFee(0.00005)
    }

    let loadGasFeeInterval
    if (selectedAccount.type === TYPE.ETHEREUM) {
      loadGasFee()
      loadGasFeeInterval = setInterval(() => {
        loadGasFee()
      }, 3000)
    } 

    if (selectedAccount.type === TYPE.ARWEAVE) loadArFee()

    return (() => clearInterval(loadGasFeeInterval))
  }, [])

  return (
    <Modal onClose={onClose} className='transaction-modal'>
      <ModalTitle amount={sentAmount} currency={currency}/>
      <div className="modal-account-address confirm-transaction">{accountAddress}</div>
      {gasFee !== 0 && <div>Gas fee {gasFee} ETH</div>}
      {arFee !== 0 && <div>AR fee {arFee} AR</div>}
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
