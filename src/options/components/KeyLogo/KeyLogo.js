import React, { useState } from 'react'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
import ArweaveLock from 'img/v2/onboarding/arweave-lock-icon.svg'
import EthereumLock from 'img/v2/onboarding/ethereum-lock-icon.svg'
import KeyDarkBackground from 'img/v2/onboarding/key-background-dark.svg'
import KeyHoverBackground from 'img/v2/onboarding/key-background-hover.svg'
import KoiiLock from 'img/v2/onboarding/koii-lock-icon.svg'
import KoiiLockOpacity from 'img/v2/onboarding/koii-lock-icon-opacity.svg'
import SolanaLock from 'img/v2/onboarding/solana-lock-icon.svg'

const KeyLogo = ({ type, inProcessing, networkProcessing, handleOnClick, data_testid }) => {
  const [isHover, setIsHover] = useState(false)
  return (
    <div
      data-testid={data_testid}
      className={clsx(
        inProcessing
          ? networkProcessing === type
            ? 'cursor-wait'
            : 'cursor-not-allowed'
          : 'cursor-pointer',
        'relative'
      )}
      onMouseEnter={() => {
        setIsHover(true)
      }}
      onMouseLeave={() => setIsHover(false)}
      // onClick={() => {
      //   if (type !== TYPE.K2) handleOnClick(type)
      // }}
      onClick={() => handleOnClick(type)}
    >
      {/* {isHover && type !== TYPE.K2 ? (
        <KeyHoverBackground className="z-0" />
      ) : (
        <KeyDarkBackground className="z-0" />
      )} */}
      {isHover ? <KeyHoverBackground className="z-0" /> : <KeyDarkBackground className="z-0" />}
      {type === TYPE.SOLANA && <SolanaLock className="z-10 absolute top-2 left-8.5" />}
      {type === TYPE.ETHEREUM && <EthereumLock className="z-10 absolute top-2 left-8.5" />}
      {type === TYPE.K2 && (
        <>
          <KoiiLock className="z-10 absolute top-2 left-8.5" />
          <KoiiLockOpacity className="z-10 absolute top-2 left-8.5" style={{ height: '68.22px' }} />
        </>
      )}
      {type === TYPE.ARWEAVE && <ArweaveLock className="z-10 absolute top-2.5 left-8.5" />}
    </div>
  )
}

export default KeyLogo
