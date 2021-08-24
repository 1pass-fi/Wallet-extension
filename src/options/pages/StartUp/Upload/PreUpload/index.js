import React, { useEffect } from 'react'
import isEmpty from 'lodash/isEmpty'

import EthereumLogo from 'img/startup/ethereum-logo.svg'
import FinnieLogo from 'img/startup/finnie-logo.svg'

import Dropfile from '../../shared/Dropfile'
import WalletType from '../../shared/WalletType'

import { TYPE } from 'account/accountConstants'

import useEthereumNetworks from '../../shared/useEthereumNetworks'

export default ({ nextStep, setWalletType}) => {
  return (
    <div>
      <div className='title'>Import a key with a .JSON file</div>
      <div className='wallet-types'>
        <WalletType
          icon={FinnieLogo}
          title={(props) => (
            <div {...props}>
                    Koii Key&nbsp;<span>(Arweave)</span>
            </div>
          )}
          description={(props) => (
            <div {...props}>
                    If you’re brand new and not sure what you need,&nbsp;
              <span>start here</span>.
            </div>
          )}
          selected={false}
          onClick={() => {
            setWalletType(TYPE.ARWEAVE)
            nextStep()
          }}
        />

        <WalletType
          icon={EthereumLogo}
          title={(props) => <div {...props}>Ethereum Key</div>}
          description={(props) => (
            <div {...props}>
                    Ethereum keys are great for&nbsp;
              <span>cross-chain transactions</span>.
            </div>
          )}
          selected={false}
          onClick={() => {
            setWalletType(TYPE.ETHEREUM)
            nextStep()
          }}
        />
      </div>
    </div>
  )
}
