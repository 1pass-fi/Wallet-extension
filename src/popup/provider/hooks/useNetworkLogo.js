import React, { useMemo } from 'react'
import EvmLogo from 'img/evm-logo.svg'
import PolygonLogo from 'img/polygon-logo.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'

const useNetworkLogo = ({ networkName }) => {
  const networkLogo = useMemo(() => {
    switch (networkName) {
      case 'ETH Mainnet':
        return <EthLogo />
      case 'Goerli Testnet':
        return <EthLogo />
      case 'Polygon Testnet':
        return <PolygonLogo />
      case 'Polygon':
        return <PolygonLogo />
    }

    return <EvmLogo />
  }, [networkName])

  const networkSymbol = useMemo(() => {
    switch(networkName) {
      case 'ETH Mainnet':
        return <div>ETH</div>
      case 'Goerli Testnet':
        return <div>ETH</div>
      case 'Polygon Testnet':
        return <div>MATIC</div>
      case 'Polygon':
        return <div>MATIC</div>
    }
  })

  const networkLogoPath = useMemo(() => {
    switch (networkName) {
      case 'ETH Mainnet':
        return 'img/v2/ethereum-logos/ethereum-logo.svg'
      case 'Goerli Testnet':
        return 'img/v2/ethereum-logos/ethereum-logo.svg'
      case 'Polygon Testnet':
        return 'img/polygon-logo.svg'
      case 'Polygon':
        return 'img/polygon-logo.svg'
    }

    return 'img/evm-logo.svg'
  })

  return { networkLogo, networkLogoPath, networkSymbol }
}

export default useNetworkLogo
