import React from 'react'
import isEmpty from 'lodash/isEmpty'

import EthereumLogo from 'img/startup/ethereum-logo.svg'
import FinnieLogo from 'img/startup/finnie-logo.svg'

import Dropfile from '../../shared/Dropfile'
import WalletType from '../../shared/WalletType'

import { TYPE } from 'account/accountConstants'

export default ({ file, setFile, nextStep, walletType, setWalletType }) => {
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
          selected={walletType === TYPE.ARWEAVE}
          onClick={() => setWalletType(TYPE.ARWEAVE)}
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
          selected={walletType === TYPE.ETHEREUM}
          onClick={() => setWalletType(TYPE.ETHEREUM)}
        />
      </div>
      {walletType && <div className='upload-file'>
        
        <div className='description'>
        Drag & drop an existing .JSON key file here or click to browse your
        computer.
        </div>
        <Dropfile file={file} setFile={setFile} />
        <button
          disabled={isEmpty(file)}
          onClick={nextStep}
          className='upload-file-button white-button'
        >
        Upload File
        </button>
      </div>}
    </div>
  )
}
