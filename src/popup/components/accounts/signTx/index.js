import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import ArweaveIcon from 'img/arweave-icon.svg'
import KoiIcon from 'img/koi-logo-no-bg.svg'
import Card from 'shared/card'
import Button from 'shared/button'

import { getChromeStorage, removeChromeStorage, numberFormat, fiatCurrencyFormat } from 'utils'

import { STORAGE, REQUEST, ERROR_MESSAGE, RATE } from 'koiConstants'
import { signTransaction } from 'actions/koi'
import { setError } from 'actions/error'

import './index.css'

export const SignTx = ({ signTransaction, setError }) => {
  const history = useHistory()
  const [sourceAccount, setSourceAccount] = useState({
    address: '',
    type: 'koi',
  })
  const [destinationAccount, setDestinationAccount] = useState({
    address: '',
    type: 'arweave',
  })
  const [origin, setOrigin] = useState('')
  const [qty, setQty] = useState(null)

  const walletIcon = {
    koi: <KoiIcon className='icon' />,
    arweave: <ArweaveIcon />,
  }

  useEffect(() => {
    const loadRequest = async () => {
      const request = (await getChromeStorage(STORAGE.PENDING_REQUEST))[
        STORAGE.PENDING_REQUEST
      ]
      const address = (await getChromeStorage(STORAGE.KOI_ADDRESS))[
        STORAGE.KOI_ADDRESS
      ]
      const {
        origin: requestOrigin,
        qty,
        address: targetAddress,
      } = request.data

      setSourceAccount({ address, type: 'koi' })
      setDestinationAccount({ address: targetAddress, type: 'arweave' })
      setOrigin(requestOrigin)
      setQty(qty)
    }

    loadRequest()
  }, [])

  const handleOnClick = async (confirm) => {
    try {
      if (confirm) {
        if (!(await getChromeStorage(STORAGE.PENDING_REQUEST))[STORAGE.PENDING_REQUEST]) throw new Error(ERROR_MESSAGE.REQUEST_NOT_EXIST)
        const request = (await getChromeStorage(STORAGE.PENDING_REQUEST))[STORAGE.PENDING_REQUEST]
        const { transaction } = request.data
        signTransaction({ tx: transaction, confirm: true })
        removeChromeStorage(STORAGE.PENDING_REQUEST)
      } else {
        signTransaction({ tx: null, confirm: false })
        removeChromeStorage(STORAGE.PENDING_REQUEST)
      }

      history.push('/account')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className='sign-tx'>
      <div className='account-section'>
        <div className='account-source'>
          <div>From:</div>
          <div className='source-account account'>
            <div className='logo-icon'>
              {walletIcon[sourceAccount.type]}
            </div>
            <div className='account-info'>
              <div className='title'>Account 1</div>
              <div className='address'>
                {sourceAccount.address}
              </div>
            </div>
          </div>
          <div>To:</div>
          <div className='destination-account account'>
            <div className='logo-icon'>
              {walletIcon[destinationAccount.type]}
            </div>
            <div className='account-info'>
              <div className='address'>
                {destinationAccount.address}
              </div>
            </div>
          </div>
        </div>
        <div className='origin'>
          <a href={origin}>{origin}</a>
        </div>
      </div>
      <div className='content-section'>
        <Card className='transaction-detail'>
          <div className='label'>Transaction details</div>
          <div className='details'>
            <div className='detail-row'>Send</div>
            <div className='detail-row amount'>
              <div className='koi'>{numberFormat(qty)} KOI</div>
              <div className='usd'>~{fiatCurrencyFormat(qty*RATE.KOI)} USD</div>
            </div>
          </div>
          <div className='button-group'>
            <Button
              label='Confirm'
              onClick={() => handleOnClick(true)}
              className='button confirm'
            />
            <Button
              label='Reject'
              type='layout'
              className='button reject'
              onClick={() => handleOnClick(false)}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default connect(null, { signTransaction, setError })(SignTx)
