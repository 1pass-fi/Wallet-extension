import React, { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'react-qr-code'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import AddressCopied from 'img/address-copied.svg'
import LittleFish from 'img/little-fish.svg'
import CopyIdBtn from 'img/v2/copy-id-button.svg'
import BackBtn from 'img/v2/popup-back-btn.svg'
import Background from 'img/v2/popup-receive-bg.svg'
// selectors
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'

const Receive = () => {
  const history = useHistory()
  const displayingAccount = useSelector(getDisplayingAccount)

  const { accountName, address } = displayingAccount

  const [isCopied, setIsCopied] = useState(false)

  const onCopy = () => {
    setIsCopied(true)
  }

  useEffect(() => {
    if (address) {
      navigator.clipboard.writeText(address)
      setIsCopied(true)
    }
  }, [address])

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 3000)
    }
  }, [isCopied])

  return (
    <div className="w-full relative bg-white flex flex-col items-center pt-9.75">
      <Background className="z-10 absolute top-0 left-6.75" />
      <BackBtn
        onClick={() => history.goBack()}
        className="w-8.75 h-8.75 z-20 absolute top-3.25 left-3.75 cursor-pointer"
      />
      <div
        className="mt-8 z-20 flex flex-col items-center justify-center bg-white bg-opacity-80 rounded"
        style={{ width: '304px', height: '363px' }}
      >
        <div className="text-blue-800 text-sm mb-3.5">COPY YOUR KEY TO SEND SOME LOVE</div>
        <div className='mb-3.5'><LittleFish /></div>
        <div className="text-blue-800 text-25px mb-3.5">{accountName}</div>
        {/* <QRCode value={address} size={230} /> */}
        <div className="text-blue-800 text-sm mb-3.5">KEY ADDRESS</div>
        <div className="mb-3.5 mt-3.5 w-60 text-center text-sm text-blueGray-800 font-semibold leading-6 break-words">
          {address}
        </div>
        <CopyToClipboard text={address} onCopy={onCopy}>
          {!isCopied ? <CopyIdBtn className="cursor-pointer" /> :
            <AddressCopied />
          }
        </CopyToClipboard>
      </div>
    </div>
  )
}

export default Receive
