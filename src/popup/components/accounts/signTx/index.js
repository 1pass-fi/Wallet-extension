// modules
import Web3 from 'web3'
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
import { setIsLoading } from 'actions/loading'

// styles
import './index.css'

// services
import storage from 'services/storage'
import { popupAccount } from 'services/account'


export const SignTx = ({ signTransaction, setError, accountName, price, setIsLoading }) => {
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
  const [isUpdate, setIsUpdate] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const [isEthereum, setIsEthereum] = useState(false)

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

      console.log('request data', request)
      
      const {
        origin: requestOrigin,
        qty,
        fee,
        address: targetAddress,
        isKoiTransfer,
        koiiQty,
        isCreateDID,
        isUpdateDID,
        params,
        isEthereum
      } = request.data

      setOrigin(requestOrigin)
      if (!isEthereum) {
        setSourceAccount({ address, type: 'koi' })
        setDestinationAccount({ address: targetAddress, type: 'arweave' })
        setQty(qty)
        setFee(fee)
        setKoiiTransfer(isKoiTransfer || isCreateDID)
        setKoiiQuantity(koiiQty)
        setIsUpdate(isUpdateDID)
        setIsCreate(isCreateDID)        
      } else {
        const { from, to, value, gasLimit, gasPrice } = params[0]
        setIsEthereum(true)
        setCurrency('ETH')
        setSourceAccount({ address: from, type: 'eth' })
        setDestinationAccount({ address: to, type: 'eth' })
        setQty(parseInt(value, 16))
      }

    }

    loadRequest()
  }, [])

  useEffect(() => {
    if(isEthereum) {
      const calculateEthFee = async () => {
        const provider = await storage.setting.get.ethereumProvider()

        const web3 = new Web3(provider)
          
        const currentGasPrice = await web3.eth.getGasPrice()
        console.log('current gas price', currentGasPrice)
        const currentGasPriceBN = Web3.utils.toBN(currentGasPrice)
        
        const totalFee = Web3.utils.fromWei(currentGasPriceBN.muln(21000)) // 21,000 is the amount of gas needed to send ETH
        setFee(totalFee) 
      }
  
      calculateEthFee()
      const intervalId = setInterval(() => {
        calculateEthFee()
      }, 3000)
  
      return () => clearInterval(intervalId)
    }
  }, [sourceAccount, isEthereum])

  const handleOnClick = async (confirm) => {
    try {
      const request = await storage.generic.get.pendingRequest()
      if (isEmpty(request)) throw new Error(ERROR_MESSAGE.REQUEST_NOT_EXIST)
      const { transaction, origin, params, requestId } = request.data

      if (confirm) {
        setIsLoading(true)
        chrome.runtime.sendMessage({ requestId, approved: true }, function(response) {
          chrome.runtime.onMessage.addListener(function(message) {
            if (message.requestId === requestId) {
              setIsLoading(false)
              window.close()
            }
          })
        })
        // signTransaction({ tx: transaction, confirm: true , origin, isUpdate, isCreate})
        await storage.generic.set.pendingRequest({})
      } else {
        chrome.runtime.sendMessage({ requestId, approved: false }, function(response) {
          chrome.runtime.onMessage.addListener(function(message) {
            console.log('response message', message)
            if (message.requestId === requestId) {
              setIsLoading(false)
              window.close()
            }
          })
        })
        // signTransaction({ tx: null, confirm: false })
        await storage.generic.set.pendingRequest({})
      }
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
                <div className='koi'>{transactionAmountFormat(fee)} {isEthereum ? 'ETH' : 'AR'}</div>
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
                </div>
              </div>
            }
            { currency === 'ETH' &&
              <div className='detail total'>
                <div className='detail-row row-label'>Total</div>
                <div className='detail-row amount'>
                  <div className='koi'>{transactionAmountFormat(qty+fee)} ETH</div>
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

export default connect(mapStateToProps, { signTransaction, setError, setIsLoading })(SignTx)
