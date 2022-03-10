import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'react-qr-code'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Background from 'img/v2/popup-receive-bg.svg'
import CopyIdBtn from 'img/v2/copy-id-button.svg'
import BackBtn from 'img/v2/popup-back-btn.svg'

const Receive = () => {
  const history = useHistory()

  let defaultAccount = useSelector((state) => state.defaultAccount.AR)
  if (isEmpty(defaultAccount?.address)) {
    defaultAccount = useSelector((state) => state.defaultAccount.ETH)
  }

  const { accountName, address } = defaultAccount

  const [isCopied, setIsCopied] = useState(false)

  const onCopy = () => {
    setIsCopied(true)

    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="w-full relative bg-white flex flex-col items-center pt-9.75">
      <Background className="z-10 absolute top-0 left-6.75" />
      <BackBtn
        onClick={() => history.goBack()}
        className="w-8.75 h-8.75 z-20 absolute top-3.25 left-3.75 cursor-pointer"
      />
      <div
        className="z-20 flex flex-col items-center justify-center bg-white bg-opacity-80 rounded"
        style={{ width: '304px', height: '363px' }}
      >
        <div className="text-blue-800 text-25px mb-3.5">{accountName}</div>
        <QRCode value={address} size={230} />
        <div className="mt-3.5 w-60 text-center text-sm text-blueGray-800 font-semibold leading-6 break-words">
          {address}
        </div>
      </div>
      <div className="z-20 relative mt-4.5">
        <CopyToClipboard text={address} onCopy={onCopy}>
          <CopyIdBtn className="cursor-pointer" />
        </CopyToClipboard>
        {isCopied && (
          <span className="text-11px absolute top-4.5 left-14 text-blue-800">Copied!</span>
        )}
      </div>
    </div>
  )
}

export default Receive
