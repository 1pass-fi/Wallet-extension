import React, { useEffect, useRef, useState } from 'react'

import Button from 'finnie-v2/components/Button'

import BackIcon from 'img/v2/back-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-blue.svg'
import ShareIcon from 'img/v2/share-icon-white.svg'

const GetRewardsModal = ({ redeemRewards, rewards, close }) => {
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
          <div className="m-auto">Get My Rewards</div>
          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>
        <div className="mt-9 w-115 text-sm tracking-finnieSpacing-tight text-center">
          Redeem your Referral Rewards Now.
        </div>
        <div className="mt-5.25 w-115 text-sm tracking-finnieSpacing-tight text-center">
          Click here to transfer:
        </div>
        <div className="mt-5.25 w-115 text-2xl font-semibold tracking-finnieSpacing-tight text-center">
          {rewards} KOII
        </div>
        <div className="mt-5.25 w-115 text-sm tracking-finnieSpacing-tight text-center">
          to your primary wallet.
        </div>
        <Button
          style={{ width: '228px', height: '46px' }}
          className="mt-6 text-base font-semibold"
          text="Redeem Rewards"
          variant="indigo"
          icon={ShareIcon}
          size="lg"
          onClick={() => redeemRewards()}
        />
      </div>
    </div>
  )
}

export default GetRewardsModal
