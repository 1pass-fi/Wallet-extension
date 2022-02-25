// modules
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

// components
// import Modal from 'popup/components/shared/modal/index'
import Button from 'popup/components/shared/button/'

// utils
import { numberFormat, fiatCurrencyFormat, calculateGasFee, winstonToAr } from 'utils'
import { getDisplayAddress } from 'options/utils'

// styles
// import './index.css'
import { popupAccount } from 'services/account'

import arweave from 'services/arweave'
import { TYPE } from 'constants/accountConstants'

import BackIcon from 'img/v2/back-icon.svg'
import CloseIcon from 'img/v2/close-icon-white.svg'
import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'

const TransactionConfirmModal = ({
  sentAmount,
  recipient,
  currency,
  onClose,
  onSubmit,
  selectedAccount,
  gasFee,
  setGasFee,
  arFee,
  setArFee
}) => {
  const price = useSelector((state) => state.price)

  const accountAddress = recipient.address

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

    return () => clearInterval(loadGasFeeInterval)
  }, [])

  return (
    <div className="w-full h-full z-51 m-auto top-0 left-0 fixed flex flex-col items-center">
      <div
        className="relative bg-white shadow-md rounded m-auto flex flex-col items-center"
        style={{ width: '381px', height: '453px' }}
      >
        <div
          className="relative bg-blue-800 w-full flex items-center justify-center"
          style={{ height: '67px' }}
        >
          <BackIcon
            style={{ width: '30px', height: '30px' }}
            className="absolute top-4 left-4 cursor-pointer"
            onClick={onClose}
          />
          <div className="font-semibold text-xl text-white leading-6 text-center tracking-finnieSpacing-wide">
            Confirm Transaction
          </div>
          <CloseIcon
            style={{ width: '30px', height: '30px' }}
            className="absolute top-4 right-4 cursor-pointer"
            onClick={onClose}
          />
        </div>
        <div
          className="mt-7 text-base leading-6 tracking-finnieSpacing-wide text-indigo text-center"
          style={{
            width: '288px'
          }}
        >
          Double check the details. This transaction cannot be undone.
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5">
          <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
            <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
              From:
            </div>
            <div className="text-lg leading-10 tracking-finnieSpacing-tightest text-blue-800">
              {selectedAccount.label}
            </div>
            <div className="text-2xs tracking-finnieSpacing-tightest text-success-700">
              {getDisplayAddress(selectedAccount.address)}
            </div>
          </div>

          <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
            <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
              Sending:
            </div>
            {currency === 'KOII' && (
              <>
                <div className="flex items-center text-lg leading-10 tracking-finnieSpacing-tightest text-blue-800">
                  {sentAmount} KOII
                  <FinnieIcon className="ml-1 w-4 h-4" />
                </div>
              </>
            )}
            {currency === 'AR' && (
              <>
                <div className="flex items-center text-lg leading-10 tracking-finnieSpacing-tightest text-blue-800">
                  {sentAmount} AR
                  <ArweaveIcon className="ml-1 w-4 h-4" />
                </div>
                <div className="text-2xs tracking-finnieSpacing-tightest text-blueGray-800">
                  ${fiatCurrencyFormat(sentAmount * price.AR)} USD
                </div>
              </>
            )}
            {currency === 'ETH' && (
              <>
                <div className="flex items-center text-lg leading-10 tracking-finnieSpacing-tightest text-blue-800">
                  {sentAmount} ETH
                  <EthereumIcon className="ml-1 w-4 h-4" />
                </div>
                <div className="text-2xs tracking-finnieSpacing-tightest text-blueGray-800">
                  ${fiatCurrencyFormat(sentAmount * price.ETH)} USD
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
            <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
              To:
            </div>
            <div className="text-lg leading-10 tracking-finnieSpacing-tightest text-blue-800">
              {recipient.name}
            </div>
            <div className="text-2xs tracking-finnieSpacing-tightest text-success-700">
              {getDisplayAddress(accountAddress)}
            </div>
          </div>

          <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
            <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
              Estimated Costs:
            </div>
            {gasFee !== 0 && currency === 'ETH' && (
              <div className="text-11px leading-5 text-blue-800">{gasFee} ETH</div>
            )}
            {arFee !== 0 && (currency === 'KOII' || currency === 'AR') && (
              <div className="text-base leading-5 text-blue-800">{arFee} AR</div>
            )}
            <div className="text-2xs leading-3 tracking-finnieSpacing-wider text-success-700">
              Storage Fee
            </div>
          </div>
        </div>
        <div className="absolute bottom-7.25 w-full flex justify-between px-4.5">
          <button
            onClick={onClose}
            className="bg-white border-2 border-blue-800 rounded-sm shadow text-base leading-4 text-center text-blue-800"
            style={{ width: '160px', height: '38px' }}
          >
            Reject
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-800 rounded-sm shadow text-base leading-4 text-center text-white"
            style={{ width: '160px', height: '38px' }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionConfirmModal
