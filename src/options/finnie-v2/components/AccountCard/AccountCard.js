import React, { useState } from 'react'

import { TYPE } from 'constants/accountConstants'

import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-orange.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'
import SolLogo from 'img/v2/solana-logo.svg'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'

const AccountCard = ({ type }) => {
  const [isDrop, setDrop] = useState(false)
  console.log('type', type)
  return (
    <div className="relative mt-4.5">
      <div
        className="bg-trueGray-100 rounded-lg flex items-center justify-start shadow-md z-50"
        style={{ width: '707px', height: '124px' }}
      >
        {type === TYPE.K2 && <KoiiLogo style={{ width: '25px', height: '25px' }} />}
        {type === TYPE.ETHEREUM && <EthLogo style={{ width: '25px', height: '25px' }} />}
        {type === TYPE.SOLANA && <SolLogo style={{ width: '25px', height: '25px' }} />}
        {type === TYPE.ARWEAVE && <ArweaveLogo style={{ width: '25px', height: '25px' }} />}

        <div className="w-5 h-5 bg-blue-200" onClick={() => setDrop((prev) => !prev)}></div>
      </div>

      {isDrop && (
        <div className="bg-trueGray-500 -mt-1" style={{ width: '707px', height: '183px' }}></div>
      )}
    </div>
  )
}

export default AccountCard
