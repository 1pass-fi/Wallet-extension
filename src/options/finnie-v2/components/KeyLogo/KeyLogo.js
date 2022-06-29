import React, { useState } from 'react'
import clsx from 'clsx'

import KeyDarkBackground from 'img/v2/onboarding/key-background-dark.svg'
import KeyHoverBackground from 'img/v2/onboarding/key-background-hover.svg'
import SolanaLock from 'img/v2/onboarding/solana-lock-icon.svg'
import EthereumLock from 'img/v2/onboarding/ethereum-lock-icon.svg'
import KoiiLock from 'img/v2/onboarding/koii-lock-icon.svg'

import { TYPE } from 'constants/accountConstants'

const KeyLogo = ({ type, inProcessing, networkProcessing, handleOnClick }) => {
  const [isHover, setIsHover] = useState(false)
  return (
    <div
      className={clsx(
        inProcessing
          ? networkProcessing === type
            ? 'cursor-wait'
            : 'cursor-not-allowed'
          : 'cursor-pointer',
        'relative'
      )}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => handleOnClick(type)}
    >
      {isHover ? <KeyHoverBackground className="z-0" /> : <KeyDarkBackground className="z-0" />}
      {type === TYPE.SOLANA && <SolanaLock className="z-10 absolute top-2 left-8.5" />}
      {type === TYPE.ETHEREUM && <EthereumLock className="z-10 absolute top-2 left-8.5" />}
      {/* TODO - TYPE.K2 */}
      {type === TYPE.ARWEAVE && <KoiiLock className="z-10 absolute top-2 left-8.5" />}
    </div>
  )
}

export default KeyLogo
