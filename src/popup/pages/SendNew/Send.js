import React, { useEffect, useMemo, useRef, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { setError } from 'actions/error'
import { setIsLoading } from 'actions/loading'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
import BackBtn from 'img/popup/back-button.svg'
import ArrowIconBlue from 'img/popup/down-arrow-icon-blue.svg'
import SendBackgroundLeft from 'img/popup/send-background-left.svg'
import SendBackgroundRight from 'img/popup/send-background-right.svg'
import FinnieIcon from 'img/v2/k2-logos/finnie-k2-logo.svg'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { formatNumber } from 'options/utils'
import TokenDropdown from 'popup/components/TokenDropdown'
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'

// hooks
import useMethod from './hooks/useMethod'
import useSelectedAccount from './hooks/useSelectedAccount'
import useTokenList from './hooks/useTokenList'
import useValidate from './hooks/useValidate'
import SendTokenForm from './SendTokenForm'

const Send = ({ setShowSigning, setShowEthSigning, setShowArSigning, setError, setIsLoading }) => {
  const displayingAccount = useSelector(getDisplayingAccount)

  const [selectedAccount, setSelectedAccount] = useState({})
  const [fontSize, setFontSize] = useState('3xl')
  const [showTokenOptions, setShowTokenOptions] = useState(false)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState({ address: '', accountName: '' })
  const [enoughGas, setEnoughGas] = useState(true)
  const [alchemyAddress, setAlchemyAddress] = useState(null)
  const [sendTokenClick, setSendTokenClick] = useState(0)
  const [recipientName, setRecipientName] = useState(null)

  const { selectedNetwork } = useSelectedAccount({ selectedAccount })
  const { tokenList, selectedToken, setSelectedToken } = useTokenList({
    selectedAccount: selectedAccount,
    selectedNetwork: selectedNetwork
  })

  useEffect(() => {
    console.log('selectedToken', selectedToken, selectedNetwork, selectedToken?.balance / Math.pow(10, selectedToken?.decimal), formatNumber(selectedToken?.balance / Math.pow(10, selectedToken?.decimal), 2), selectedToken?.balance / Math.pow(10, selectedToken?.decimal), formatNumber(selectedToken?.balance / Math.pow(10, selectedToken?.decimal), 6))
    if(selectedToken) {
      const aaaaaaaaaaaaaaaaa = (selectedToken.symbol === 'KOII' && selectedNetwork != 'K2')
        ? formatNumber(selectedToken?.balance / Math.pow(10, selectedToken?.decimal), 2)
        : formatNumber(selectedToken?.balance / Math.pow(10, selectedToken?.decimal), 6)
      console.log('aaaaaaaaaaaaaaaaa:', aaaaaaaaaaaaaaaaa)
    }
  }, [selectedToken])
  useEffect(() => {
    if (!isEmpty(displayingAccount)) {
      setSelectedAccount({
        id: displayingAccount.address,
        value: displayingAccount.address,
        label: displayingAccount.accountName,
        address: displayingAccount.address,
        type: displayingAccount.type
      })
    }
  }, [displayingAccount])

  const sender = useMemo(() => {
    return get(selectedAccount, 'address')
  }, [selectedAccount])
  const _recipient = useMemo(() => {
    return get(recipient, 'address')
  }, [recipient])
  const contractAddress = useMemo(() => {
    return get(selectedToken, 'contractAddress')
  }, [selectedToken])

  const { validated, errorMessage } = useValidate({
    selectedToken,
    amount,
    selectedAccount,
    recipient: _recipient,
    alchemyAddress
  })

  /* 
    amount in largest unit.
    For example: 0.01 -> 0.01 ETH
  */
  const { onSendTokens, getAlchemyAddress } = useMethod({
    sender,
    recipient: _recipient,
    value: amount,
    contractAddress,
    selectedToken,
    alchemyAddress,
    setAlchemyAddress,
    setIsLoading,
    recipientName,
    setRecipientName,
    selectedNetwork
  })

  const history = useHistory()

  const onChangeToken = (selectedToken) => {
    setSelectedToken(selectedToken)
  }

  const onChangeAmount = (e) => {
    setAmount(e.target.value)
    setEnoughGas(true)
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

  const handleSendToken = async () => {
    // await getAlchemyAddress()
    setSendTokenClick((prev) => ++prev)
  }

  useEffect(() => {
    const sendToken = async () => {
      if (!validated) return setError(errorMessage)
      await onSendTokens()

      switch (selectedNetwork) {
        case TYPE.ETHEREUM:
          setShowEthSigning(true)
          break
        case TYPE.ARWEAVE:
          setShowArSigning(true)
          break
        default:
          setShowSigning(true) // for Solana and K2
      }
    }
    if (sendTokenClick) sendToken()
  }, [sendTokenClick])

  const customTokenIconPath = useMemo(
    () => `img/v2/custom-tokens/custom-token-${Math.floor(Math.random() * 5)}.svg`,
    []
  )

  const tokenDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tokenDropdownRef.current && !tokenDropdownRef.current.contains(event.target)) {
        setShowTokenOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [tokenDropdownRef])

  return (
    <div className="w-full relative bg-white flex flex-col items-center pt-9.75">
      <SendBackgroundLeft className="absolute top-0 left-0" />
      <SendBackgroundRight className="absolute top-0 right-0" />
      <BackBtn
        onClick={() => history.goBack()}
        className="w-8.75 h-8.75 z-20 absolute top-3.25 left-3.75 cursor-pointer bg-white bg-opacity-70 rounded-full"
      />

      <div className="font-semibold text-xs leading-4 tracking-finnieSpacing-wide text-blue-800">
        {chrome.i18n.getMessage('amountUc')}
      </div>
      <div
        className="z-10 bg-trueGray-100 border-b-2 border-blue-800 flex"
        style={{ width: '241px', height: '45px' }}
        data-tip={
          isEmpty(selectedAccount) ? chrome.i18n.getMessage('chooseSenderAccountFirst') : ''
        }
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
          data-testid="input-send-amount"
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
          ref={tokenDropdownRef}
          role="button"
          data-testid="token-dropdown"
        >
          {isEmpty(selectedToken) && <FinnieIcon style={{ width: '34px', height: '34px' }} />}
          {!isEmpty(selectedToken) &&
            selectedToken !== 'KOII' &&
            selectedToken !== 'AR' &&
            selectedToken !== 'ETH' &&
            (selectedToken?.logo ? (
              <img src={selectedToken?.logo} style={{ width: '34px', height: '34px' }} />
            ) : (
              // <FinnieIcon style={{ width: '34px', height: '34px' }} />
              <img src={customTokenIconPath} style={{ width: '36px', height: '36px' }} />
            ))}
          <ArrowIconBlue style={{ transform: !showTokenOptions ? 'none' : 'rotateX(180deg)' }} />
          {showTokenOptions && (
            <TokenDropdown
              tokenOptions={tokenList}
              selectedToken={selectedToken}
              onChangeToken={onChangeToken}
              customTokenIconPath={customTokenIconPath}
            />
          )}
        </div>
      </div>

      <div className="text-success-700 text-base font-normal tracking-finnieSpacing-tight leading-8 select-none">
        {selectedToken
          ? `${
            selectedToken.symbol === 'KOII' && selectedNetwork != 'K2'
              ? formatNumber(selectedToken?.balance / Math.pow(10, selectedToken?.decimal), 2)
              : formatNumber(selectedToken?.balance / Math.pow(10, selectedToken?.decimal), 6)
          } ${selectedToken.symbol} ${chrome.i18n.getMessage('available')}`
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
    </div>
  )
}

export default connect(null, { setError, setIsLoading })(Send)
