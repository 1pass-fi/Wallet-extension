import React from 'react'
import QRCode from 'react-qr-code'

import BackIcon from 'img/v2/back-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-blue.svg'



const QrCodeModal = ({ account, close }) => {
  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-screen bg-black bg-opacity-25 fixed z-51 top-0 left-0">
      <div
        style={{ width: '510px' }}
        className="rounded bg-trueGray-100 flex flex-col items-center text-indigo"
      >
        <div
          className="z-20 flex flex-col items-center justify-center bg-white bg-opacity-80 rounded"
          style={{ width: '304px', height: '363px' }}
        >
          <div className="text-blue-800 text-25px mb-3.5">{account.accountName}</div>
          <QRCode value={account.address} size={230} />
          <div className="mt-3.5 w-60 text-center text-sm text-blueGray-800 font-semibold leading-6 break-words">
            {account.address}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QrCodeModal
