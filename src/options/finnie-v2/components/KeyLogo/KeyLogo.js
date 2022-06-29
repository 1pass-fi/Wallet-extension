import React from 'react'

import KeyDarkBackground from 'img/v2/onboarding/key-background-dark.svg'
import KeyHoverBackground from 'img/v2/onboarding/key-background-hover.svg'
import SolanaLock from 'img/v2/onboarding/solana-lock-icon.svg'
import EthereumLock from 'img/v2/onboarding/ethereum-lock-icon.svg'
import KoiiLock from 'img/v2/onboarding/koii-lock-icon.svg'

import { TYPE } from 'constants/accountConstants'
import clsx from 'clsx'

const KeyLogo = ({ type, isHover }) => {
  return (
    <div className="relative">
      {isHover ? <KeyHoverBackground className="z-0" /> : <KeyDarkBackground className="z-0" />}
      {type === TYPE.SOLANA && (
        <SolanaLock
          className={clsx('z-10 absolute', !isHover ? 'top-2.5 left-9.25' : 'top-3 left-9.75')}
        />
      )}
      {type === TYPE.ETHEREUM && (
        <EthereumLock
          className={clsx('z-10 absolute', !isHover ? 'top-2.5 left-9.25' : 'top-3 left-9.75')}
        />
      )}
      {/* TODO - TYPE.K2 */}
      {type === TYPE.ARWEAVE && (
        <KoiiLock
          className={clsx('z-10 absolute', !isHover ? 'top-2.5 left-9.25' : 'top-3 left-9.75')}
        />
      )}
    </div>
  )
}

export default KeyLogo
