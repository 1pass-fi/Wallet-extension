import React, { useRef, useEffect } from 'react'
import QRCode from 'react-qr-code'

import CloseIcon from 'img/v2/close-icon-blue.svg'

const QrCodeModal = ({ account, close }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalRef])

  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-screen bg-black bg-opacity-25 fixed z-51 top-0 left-0">
      <div
        style={{ width: '510px' }}
        className="rounded bg-trueGray-100 flex flex-col items-center text-indigo"
        ref={modalRef}
      >
        <div className="flex h-16.75 rounded-t bg-trueGray-100 shadow-md w-full font-semibold text-xl tracking-finnieSpacing-wide relative">
          <div className="m-auto">QR Code</div>
          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>
        <div
          className="z-20 flex flex-col items-center justify-center bg-white bg-opacity-80 rounded m-4"
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
