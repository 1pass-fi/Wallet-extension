import React from 'react'

import EthereumLogo from 'img/startup/ethereum-logo.svg'
import FinnieLogo from 'img/startup/finnie-logo.svg'

import WalletType from '../../shared/WalletType'
import GoBackBtn from 'options/components/GoBackButton'

import { TYPE } from 'constants/accountConstants'
import { SHOW_ETHEREUM } from 'constants/koiConstants'


export default ({ nextStep, setWalletType, previousStep}) => {
  return (
    <div className='upload-file-form'>
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
      </div>
      <GoBackBtn goToPreviousStep={previousStep} />
    </div>
  )
}
