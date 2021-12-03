import React from 'react'

import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-orange.svg'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'

import formatNumber from 'finnie-v2/utils/formatNumber'

const Balance = ({ koiiBalance, arBalance }) => {
  return (
    <div className="min-w-22.5 h-8 flex justify-between items-center px-2 bg-white bg-opacity-20 rounded text-white shadow">
      <KoiiLogo className="w-6 h-6 mr-2" />
      <span className="font-semibold text-sm mr-3.75">{formatNumber(koiiBalance, 2)}</span>
      <ArweaveLogo className="w-6 h-6 mr-2" />
      <span className="font-semibold text-sm">{formatNumber(arBalance, 4)}</span>
    </div>
  )
}

export default Balance
