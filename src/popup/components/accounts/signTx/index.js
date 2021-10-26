// modules
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

// assets
import ArweaveIcon from 'img/arweave-icon.svg'
import KoiIcon from 'img/koi-logo-bg.svg'

// components
import Card from 'shared/card'
import Button from 'shared/button'

// utils
import { getChromeStorage, removeChromeStorage, transactionAmountFormat, fiatCurrencyFormat } from 'utils'
import { utils } from 'utils'

// constants
import { STORAGE, ERROR_MESSAGE } from 'constants/koiConstants'

// actions
import { signTransaction } from 'actions/koi'
import { setError } from 'actions/error'

// styles
import './index.css'
import storage from 'services/storage'


export const SignTx = ({ signTransaction, setError, accountName, price }) => {
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
  const [currency, setCurrency] =  useState('AR')
  const [fee, setFee] = useState(null)
  const [koiiTransfer, setKoiiTransfer] = useState(false)
  const [koiiQuantity, setKoiiQuantity] = useState(0)

  const walletIcon = {
    koi: <KoiIcon className='icon' />,
    arweave: <ArweaveIcon />,
  }

  useEffect(() => {
    const loadRequest = async () => {
      const request = await storage.generic.get.pendingRequest()
      const { origin } = request.data
      const siteAddressDict = await storage.setting.get.siteAddressDictionary()

      const address = siteAddressDict[origin]
      
      const {
        origin: requestOrigin,
        qty,
        fee,
        address: targetAddress,
        isKoiTransfer,
        koiiQty
      } = request.data

      setSourceAccount({ address, type: 'koi' })
      setDestinationAccount({ address: targetAddress, type: 'arweave' })
      setOrigin(requestOrigin)
      setQty(qty)
      setFee(fee)
      setKoiiTransfer(isKoiTransfer)
      setKoiiQuantity(koiiQty)
    }

    loadRequest()
  }, [])

  const handleOnClick = async (confirm) => {
    try {
      if (confirm) {
        const request = await storage.generic.get.pendingRequest()
        if (isEmpty(request)) throw new Error(ERROR_MESSAGE.REQUEST_NOT_EXIST)
        const { transaction, origin } = request.data
        signTransaction({ tx: transaction, confirm: true , origin})
        await storage.generic.set.pendingRequest({})
      } else {
        signTransaction({ tx: null, confirm: false })
        await storage.generic.set.pendingRequest({})
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
              <div className='title'>{accountName}</div>
              <div className='address' data-testid='source-address'>
                {sourceAccount.address}
              </div>
            </div>
          </div>
          {destinationAccount.address && <div>To:</div>}
          {destinationAccount.address && <div className='destination-account account'>
            <div className='logo-icon'>
              {walletIcon[destinationAccount.type]}
            </div>
            <div className='account-info'>
              <div className='address' data-testid='target-address'>
                {destinationAccount.address}
              </div>
            </div>
          </div>}
        </div>
        <div className='origin'>
          <a href={origin} data-testid='origin'>{origin}</a>
        </div>
      </div>
      <div className='content-section'>
        <Card className='transaction-detail'>
          <div className='label'>Transaction details</div>
          <div className='details'>
            <div className={`detail send ${currency.toLowerCase()}`}> 
              <div className='detail-row row-label'>Send</div>
              <div className='detail-row amount'>
                <div className='koi'>{transactionAmountFormat(qty)} {currency}</div>
                <div className='usd'>~{fiatCurrencyFormat(qty*price[currency])} USD</div>
              </div>
            </div>
            <div className='detail fee'>
              <div className='detail-row row-label'>Fee</div>
              <div className='detail-row amount'>
                <div className='koi'>{transactionAmountFormat(fee)} AR</div>
                <div className='usd'>~{fiatCurrencyFormat(fee*price.AR)} USD</div>
              </div>
            </div>
            { currency === 'AR' &&
              <div className='detail total'>
                <div className='detail-row row-label'>Total</div>
                <div className='detail-row amount'>
                  {koiiTransfer &&
                    <div className='koi'>{transactionAmountFormat(koiiQuantity)} KOII</div>
                  }
                  <div className='koi'>{transactionAmountFormat(qty+fee)} AR</div>
                  <div className='usd'>~{fiatCurrencyFormat((qty+fee)*price.AR)} USD</div>
                </div>
              </div>
            }
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

export const mapStateToProps = (state) => ({ accountName: state.accountName, price: state.price })

export default connect(mapStateToProps, { signTransaction, setError })(SignTx)
