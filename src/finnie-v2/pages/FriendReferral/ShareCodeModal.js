import React, { useEffect, useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import Button from 'finnie-v2/components/Button'
import { shareFriendCode } from 'options/helpers'

import BackIcon from 'img/v2/back-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-blue.svg'
import CopyIcon from 'img/v2/copy-icon-white.svg'

import TwitterIcon from 'img/v2/share-modal-icons/twitter-icon.svg'
import FacebookIcon from 'img/v2/share-modal-icons/facebook-icon.svg'
import LinkedIn from 'img/v2/share-modal-icons/linkedin-icon.svg'
import MailIcon from 'img/v2/share-modal-icons/mail-icon.svg'
import EmbedIcon from 'img/v2/share-modal-icons/embed-icon.svg'

const ShareCodeModal = ({ code, close }) => {
  const [isCopied, setIsCopied] = useState(false)
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
        style={{ width: '586px', height: '360px' }}
        className="rounded bg-trueGray-100 flex flex-col items-center text-indigo"
        ref={modalRef}
      >
        <div className="flex h-16.75 rounded-t bg-trueGray-100 shadow-md w-full font-semibold text-xl tracking-finnieSpacing-wide relative">
          <BackIcon onClick={close} className="w-7 h-7 top-4 left-4 absolute cursor-pointer" />
          <div className="m-auto">Share to earn Attention Rewards</div>
          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>
        <div className="mt-7 w-115 text-sm tracking-finnieSpacing-tight text-center">
          Earn attention rewards forever through Koii. Copy this link and share on your favorite
          social platforms:
        </div>
        <div className="mt-4 text-base font-bold leading-7">Share Code</div>
        <div
          style={{ width: '386px', height: '32px' }}
          className="flex items-center justify-center mt-1.5 mb-5 border-2 border-indigo text-sm tracking-finnieSpacing-tight text-center"
        >
          {code}
        </div>

        <CopyToClipboard text={code}>
          <Button
            style={{ width: '200px', height: '40px' }}
            className="text-base font-semibold"
            text={isCopied ? 'Copied' : 'Copy Code'}
            variant="indigo"
            icon={CopyIcon}
            size={'md'}
            onClick={() => setIsCopied(true)}
          />
        </CopyToClipboard>

        <div className="flex w-77.25 m-auto mt-7.5 justify-between">
          <div className="cursor-pointer" onClick={() => shareFriendCode(code, 'twitter')}>
            <TwitterIcon />
          </div>
          <div className="cursor-pointer" onClick={() => shareFriendCode(code, 'facebook')}>
            <FacebookIcon />
          </div>
          <div className="cursor-pointer" onClick={() => shareFriendCode(code, 'linkedin')}>
            <LinkedIn />
          </div>
          <a
            href={`mailto:?subject=Use my Koii Friend Referral code&body=Use my code to get 1 free NFT upload on koi.rocks: \n${code}`}
            title="Share by Email"
          >
            <MailIcon />
          </a>
          {/* <div className="cursor-pointer" onClick={() => {}}>
            <EmbedIcon />
          </div> */}
        </div>
      </div>
    </div>
  )
}
export default ShareCodeModal
