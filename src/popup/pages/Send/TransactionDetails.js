import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import ViewBlockIcon from 'img/v2/view-block.svg'

import OkBtn from 'img/v2/popup-tx-detail-ok.svg'
import { getDisplayAddress } from 'options/utils'
import { fiatCurrencyFormat } from 'utils'

const TransactionDetails = ({
  txId,
  ethReceipt,
  sentAmount,
  currency,
  recipient,
  selectedAccount,
  gasFee,
  arFee
}) => {
  const price = useSelector((state) => state.price)
  const accountAddress = recipient.address

  return currency === 'KOII' || currency === 'AR' ? (
    <div className="w-full pt-9 text-blue-800 flex flex-col items-center tracking-finnieSpacing-tighter">
      <div className="text-success-700 font-semibold text-xl">Your tokens are on the way!</div>
      <div className="w-full text-base px-12 flex gap-x-15.75 mt-6.5">
        <div style={{ width: '132px' }}>
          <div className="font-semibold">From:</div>
          <div>{selectedAccount.label}</div>
          <div className="text-2xs text-success-700">
            {getDisplayAddress('sdfkjsdhfkhsdkjfhksjdhkfhjssadasdasd')}
          </div>
        </div>
        <div>
          <div className="font-semibold">Amount:</div>
          <div>{sentAmount} KOII</div>
        </div>
      </div>
      <div className="w-full text-base px-12 flex gap-x-15.75 mt-5.5">
        <div style={{ width: '132px' }}>
          <div className="font-semibold">To:</div>
          <div>{recipient.name}</div>
          <div className="text-2xs text-success-700">{getDisplayAddress('skdjfhkjshdfkjhskjdfhksjhdfkjhskdhfjs')}</div>
        </div>
        <div>
          <div className="font-semibold">Transaction Fee:</div>
          <div className="text-base leading-5 text-blue-800">100 AR</div>
          <div className="text-2xs text-success-700">Storage Fee</div>
        </div>
      </div>
      <div className="w-full text-base px-12 flex gap-x-15.75 mt-5.5">
        <div style={{ width: '132px' }}>
          <div className="font-semibold">Status:</div>
          <div className="text-success-700">Confirmed</div>
        </div>
        <div>
          <a href={`https://viewblock.io/arweave/tx/${txId}`} target="_blank">
            <button
              style={{ width: '128px', height: '29px' }}
              className="bg-lightBlue shadow-md text-xs flex items-center justify-center rounded-sm"
            >
              <ViewBlockIcon className="w-5 mr-2" />
              Explore Block
            </button>
          </a>
        </div>
      </div>
      <div className="mt-5.5 text-blue-800 text-lg flex items-start justify-center">
        <div className="font-semibold leading-5">Total Cost: </div>
        <div className="ml-2">
          <div className="leading-5">{arFee} AR</div>
          <div className="text-2xs text-success-700">
            ${fiatCurrencyFormat(arFee * price.AR)} USD
          </div>
        </div>
      </div>
      <Link className="mt-1" to="/">
        <OkBtn className="cursor-pointer" />
      </Link>
    </div>
  ) : (
    <div className="w-full pt-9 text-blue-800 flex flex-col items-center tracking-finnieSpacing-tighter">
      <div className="text-success-700 font-semibold text-xl">Your tokens are on the way!</div>
      <div className="w-full text-base px-10 flex gap-x-4 mt-2.5">
        <div style={{ width: '166px' }}>
          <div className="font-semibold">From:</div>
          <div>{selectedAccount.label}</div>
          <div className="text-2xs text-success-700">
            {getDisplayAddress(selectedAccount.address)}
          </div>
        </div>
        {currency === 'ETH' && (
          <div>
            <div className="font-semibold">Amount:</div>
            <div>{sentAmount} ETH</div>
            <div className="text-2xs tracking-finnieSpacing-tightest text-blueGray-800">
              ${fiatCurrencyFormat(sentAmount * price.ETH)} USD
            </div>
          </div>
        )}
      </div>
      <div className="w-full text-base px-10 flex gap-x-4 mt-2.5">
        <div style={{ width: '166px' }}>
          <div className="font-semibold">To:</div>
          <div>{recipient.name}</div>
          <div className="text-2xs text-success-700">{getDisplayAddress(accountAddress)}</div>
        </div>
        <div>
          <div className="font-semibold">Status:</div>
          <div>Confirmed</div>
          <a href={`https://rinkeby.etherscan.io/tx/${txId}`} target="_blank">
            <div className="text-2xs text-success-700 underline">Explore Block</div>
          </a>
        </div>
      </div>

      {/* <div className="w-full text-base px-10 flex gap-x-4 mt-2.5">
        <div style={{ width: '166px' }}>
          <div className="font-semibold">Gas Limit (Units)</div>
          <div>0.005 ETH</div>
        </div>
        <div>
          <div className="font-semibold">Gas Used (Units)</div>
          <div>0.005 ETH</div>
        </div>
      </div>

      <div className="w-full text-base px-10 flex gap-x-4 mt-2.5">
        <div style={{ width: '166px' }}>
          <div className="font-semibold">Base Fee (GWEI)</div>
          <div>106.546584751987</div>
        </div>
        <div>
          <div className="font-semibold">Priority Fee (GWEI)</div>
          <div>1.5</div>
        </div>
      </div> */}

      <div className="w-full text-base px-10 flex gap-x-4 mt-2.5">
        <div style={{ width: '166px' }}>
          <div className="font-semibold">Total Gas Fee:</div>
          <div className="text-xs">{gasFee} ETH</div>
          <div className="text-2xs tracking-finnieSpacing-tightest text-blueGray-800">
            ${fiatCurrencyFormat(gasFee * price.ETH)} USD
          </div>
        </div>
        <div>
          <div className="font-semibold">Total Cost:</div>
          <div className="text-xs">{Number(sentAmount) + Number(gasFee)} ETH</div>
          <div className="text-2xs tracking-finnieSpacing-tightest text-blueGray-800">
            ${fiatCurrencyFormat((Number(sentAmount) + Number(gasFee)) * price.ETH)} USD
          </div>
        </div>
      </div>

      <Link className="absolute bottom-20" to="/">
        <OkBtn className="cursor-pointer" />
      </Link>
    </div>
  )
}

export default TransactionDetails
