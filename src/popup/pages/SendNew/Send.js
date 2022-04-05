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

// actions
import { makeTransfer } from 'actions/koi'
import { setIsLoading } from 'popup/actions/loading'
import { setError } from 'actions/error'

// constants
import { ERROR_MESSAGE, REQUEST } from 'constants/koiConstants'
import { TYPE } from 'constants/accountConstants'

import { formatNumber } from 'options/utils'
import { isArweaveAddress, isEthereumAddress, calculateGasFee } from 'utils'
import { popupAccount } from 'services/account'

import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'
import ArrowIconBlue from 'img/popup/down-arrow-icon-blue.svg'
import BackBtn from 'img/popup/back-button.svg'
import SendBackgroundLeft from 'img/popup/send-background-left.svg'
import SendBackgroundRight from 'img/popup/send-background-right.svg'
import storage from 'services/storage'

// hooks
import useAccountList from './hooks/useAccountList'
import useSelectedAccount from './hooks/useSelectedAccount'

const Send = () => {
  const { accountList } = useAccountList()
  const { selectedNetwork, selectedAccount, setSelectedAccount } = useSelectedAccount()

  return (
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
    </div>
  )
}

export default Send
