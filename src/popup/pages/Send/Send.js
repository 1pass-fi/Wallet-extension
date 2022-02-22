import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'

import { useHistory } from 'react-router-dom'

import TokenDropdown from 'popup/components/TokenDropdown'
import SendTokenForm from './SendTokenForm'
import TransactionConfirmModal from './TransactionConfirmModal'
import TransactionDetails from './TransactionDetails'

// constants
import { ERROR_MESSAGE } from 'constants/koiConstants'
import { TYPE } from 'constants/accountConstants'

import { formatNumber } from 'options/utils'
import { setError } from 'actions/error'
import { isArweaveAddress, isEthereumAddress } from 'utils'
import { popupAccount } from 'services/account'

import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'
import ArrowIconBlue from 'img/popup/down-arrow-icon-blue.svg'
import BackBtn from 'img/popup/back-button.svg'
import SendBackgroundLeft from 'img/popup/send-background-left.svg'
import SendBackgroundRight from 'img/popup/send-background-right.svg'

const Send = ({ setError }) => {
  const history = useHistory()

  const [fontSize, setFontSize] = useState('3xl')
  const [balance, setBalance] = useState(null)
  const [koiBalance, setKoiBalance] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [selectedToken, setSelectedToken] = useState()
  const [tokenOptions, setTokenOptions] = useState([])
  const [showTokenOptions, setShowTokenOptions] = useState(false)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [enoughGas, setEnoughGas] = useState(true)
  const [showTxDetailPage, setShowTxDetailPage] = useState(false)

  useEffect(() => {
    const getTokenOptions = async () => {
      setSelectedToken(null)
      const account = await popupAccount.getAccount({ address: selectedAccount.address })
      let options
      switch (selectedAccount.type) {
        case TYPE.ARWEAVE:
          options = [
            { value: 'AR', label: 'AR' },
            { value: 'KOII', label: 'KOII' }
          ]
          setTokenOptions(options)
          setSelectedToken('KOII')
          setBalance(await account.get.balance())
          setKoiBalance(await account.get.koiBalance())
          break
        case TYPE.ETHEREUM:
          options = [{ value: 'ETH', label: 'ETH' }]
          setTokenOptions(options)
          setSelectedToken('ETH')
          setBalance(await account.get.balance())
      }
    }

    if (selectedAccount) getTokenOptions()
  }, [selectedAccount])

  const onChangeToken = (selectedToken) => {
    setSelectedToken(selectedToken)
  }

  const onChangeAmount = (e) => {
    setAmount(e.target.value)
    if (e.target.value.length <= 8) {
      setFontSize('3xl')
      return
    }
    if (e.target.value.length > 16) {
      setFontSize('sm')
      return
    }
    if (e.target.value.length > 12) {
      setFontSize('lg')
      return
    }
    if (e.target.value.length > 8) {
      setFontSize('2xl')
      return
    }
  }

  const handleSendToken = () => {
    // validations
    if (!(recipient?.address.trim().length > 0 && amount.trim().length > 0)) {
      setError(ERROR_MESSAGE.EMPTY_FIELDS)
      return
    }
    if (Number(amount) < 0) {
      setError(ERROR_MESSAGE.INVALID_AMOUNT)
      return
    }
    if (isEmpty(selectedAccount)) {
      setError(ERROR_MESSAGE.SELECT_ACCOUNT)
      return
    }
    if (isEmpty(selectedToken)) {
      setError(ERROR_MESSAGE.SELECT_TOKEN)
      return
    }
    if (Number(amount) === 0) {
      setError(ERROR_MESSAGE.SEND_ZERO_KOI)
      return
    }

    if (selectedAccount.type === TYPE.ARWEAVE && !isArweaveAddress(recipient.address)) {
      setError('Invalid AR Address')
      return
    }

    if (selectedAccount.type === TYPE.ETHEREUM && !isEthereumAddress(recipient.address)) {
      setError('Invalid ETH Address')
      return
    }

    setShowModal(true)
  }

  const handleSendTransaction = async () => {
    try {
      // setShowModal(false)
      // setIsLoading(true)
      // if (selectedAccount.type === TYPE.ETHEREUM) {
      //   const account = await popupAccount.getAccount({ address: selectedAccount.address })
      //   const provider = await account.get.provider()
      //   if (provider.includes('mainnet')) {
      //     // setError(ERROR_MESSAGE.SEND_WITH_ETH)
      //     // setIsLoading(false)
      //     // return
      //   }
      // }
      // await makeTransfer(selectedAccount, Number(amount), recipient.address, selectedToken)
      // setIsLoading(false)
      setShowTxDetailPage(true)
      setNotification(NOTIFICATION.TRANSACTION_SENT)
      history.push(PATH.ACTIVITY)
    } catch (err) /* istanbul ignore next */ {
      setIsLoading(false)
      setError(err.message)
    }
  }

  return !showTxDetailPage ? (
    <div className="w-full relative bg-white flex flex-col items-center pt-9.75">
      <SendBackgroundLeft className="absolute top-0 left-0" />
      <SendBackgroundRight className="absolute top-0 right-0" />
      <BackBtn
        onClick={() => history.goBack()}
        className="w-8.75 h-8.75 z-20 absolute top-3.25 left-3.75 cursor-pointer bg-white bg-opacity-70 rounded-full"
      />

      <div className="font-semibold text-xs leading-4 tracking-finnieSpacing-wide text-blue-800">
        AMOUNT
      </div>
      <div
        className="z-10 bg-trueGray-100 border-b-2 border-blue-800 flex"
        style={{ width: '241px', height: '45px' }}
        data-tip={isEmpty(selectedAccount) ? 'Please choose Sender Account first!' : ''}
      >
        <input
          className={clsx(
            isEmpty(selectedAccount) && 'cursor-not-allowed',
            `text-${fontSize}`,
            'text-blue-800 outline-none text-right tracking-finnieSpacing-tightest leading-12 border-b-2 border-blue-800 bg-trueGray-100 pr-1.5 pl-1'
          )}
          style={{ width: '173px', height: '45px' }}
          type="number"
          onChange={onChangeAmount}
          value={amount}
          disabled={isEmpty(selectedAccount)}
        ></input>
        <div
          className={clsx(
            isEmpty(selectedAccount) ? 'cursor-not-allowed' : 'cursor-pointer',
            'relative flex items-center justify-evenly'
          )}
          onClick={() => {
            !isEmpty(selectedAccount) && setShowTokenOptions((prev) => !prev)
          }}
          style={{ width: '68px', height: '45px' }}
        >
          {isEmpty(selectedToken) && <FinnieIcon style={{ width: '34px', height: '34px' }} />}
          {selectedToken === 'AR' && <ArweaveIcon style={{ width: '35px', height: '35px' }} />}
          {selectedToken === 'ETH' && <EthereumIcon style={{ width: '33px', height: '33px' }} />}
          {selectedToken === 'KOII' && <FinnieIcon style={{ width: '34px', height: '34px' }} />}
          <ArrowIconBlue style={{ transform: !showTokenOptions ? 'none' : 'rotateX(180deg)' }} />
          {showTokenOptions && (
            <TokenDropdown
              tokenOptions={tokenOptions}
              selectedToken={selectedToken}
              onChangeToken={onChangeToken}
            />
          )}
        </div>
      </div>

      <div className="text-success-700 text-base font-normal tracking-finnieSpacing-tight leading-8 select-none">
        {selectedToken
          ? `${
            selectedToken === 'KOII'
              ? formatNumber(koiBalance, 2)
              : formatNumber(balance, 6)
          } ${selectedToken} Available`
          : ''}
      </div>

      <div
        className="absolute bottom-0 w-full flex flex-col bg-trueGray-100"
        style={{ height: '320px' }}
      >
        <SendTokenForm
          handleSendToken={handleSendToken}
          recipient={recipient}
          setRecipient={setRecipient}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          enoughGas={enoughGas}
        />
      </div>
      <ReactTooltip place="top" effect="float" />
      {showModal && (
        <TransactionConfirmModal
          sentAmount={Number(amount)}
          currency={selectedToken}
          recipient={recipient}
          onClose={() => {
            setShowModal(false)
          }}
          onSubmit={handleSendTransaction}
          selectedAccount={selectedAccount}
        />
      )}
    </div>
  ) : (
    <TransactionDetails
      sentAmount={Number(amount)}
      currency={selectedToken}
      recipient={recipient}
      selectedAccount={selectedAccount}
    />
  )
}

const mapStateToProps = (state) => ({
  price: state.price,
  currency: state.currency,
  accounts: state.accounts
})

const mapDispatchToProps = {
  setError
}

export default connect(mapStateToProps, mapDispatchToProps)(Send)
