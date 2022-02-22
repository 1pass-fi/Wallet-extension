import React from 'react'
import { Link } from 'react-router-dom'

import ViewBlockIcon from 'img/v2/view-block.svg'

import OkBtn from 'img/v2/popup-tx-detail-ok.svg'

const TransactionDetails = ({ price, currency, accounts }) => {
  return (
    <div className="w-full pt-9 text-blue-800 flex flex-col items-center tracking-finnieSpacing-tighter">
      <div className="text-success-700 font-semibold text-xl">Your tokens are on the way!</div>
      <div className="w-full text-base px-12 flex gap-x-15.75 mt-6.5">
        <div style={{ width: '132px' }}>
          <div className="font-semibold">From:</div>
          <div>Node Account 1</div>
          <div className="text-2xs text-success-700">fdsakljfsalkfjasklfj</div>
        </div>
        <div>
          <div className="font-semibold">Amount:</div>
          <div>0.2313 KOII</div>
          <div className="text-2xs text-success-700">$123 USD</div>
        </div>
      </div>
      <div className="w-full text-base px-12 flex gap-x-15.75 mt-5.5">
        <div style={{ width: '132px' }}>
          <div className="font-semibold">To:</div>
          <div>Receipient's Name</div>
          <div className="text-2xs text-success-700">fdsakljfsalkfjasklfj</div>
        </div>
        <div>
          <div className="font-semibold">Transaction Fee:</div>
          <div>0.2313 KOII</div>
          <div>10 AR</div>
          <div className="text-2xs text-success-700">Storage Fee</div>
        </div>
      </div>
      <div className="w-full text-base px-12 flex gap-x-15.75 mt-5.5">
        <div style={{ width: '132px' }}>
          <div className="font-semibold">Status:</div>
          <div className="text-success-700">Confirmed</div>
        </div>
        <div>
          <button
            style={{ width: '128px', height: '29px' }}
            className="bg-lightBlue shadow-md text-xs flex items-center justify-center rounded-sm"
          >
            <ViewBlockIcon className="w-5 mr-2" />
            Explore Block
          </button>
        </div>
      </div>
      <div className="mt-5.5 text-blue-800 text-lg flex items-start justify-center">
        <div className="font-semibold leading-5">Total Cost: </div>
        <div className="ml-2">
          <div className="leading-5">0.00413544</div>
          <div className="text-2xs text-success-700">$123 USD</div>
        </div>
      </div>
      <Link className="mt-1" to="/">
        <OkBtn className="cursor-pointer" />
      </Link>
    </div>
  )
}

export default TransactionDetails
