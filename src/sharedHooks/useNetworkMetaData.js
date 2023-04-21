import { useEffect, useState } from 'react'
import { getEthNetworkMetadata } from 'services/getNetworkMetadata'
import storage from 'services/storage'

export const useEvmNetworkMetadata = () => {
  const [evmNetworkMetadata, setEvmNetworkMetadata] = useState({
    networkName: '---',
    rpcUrl: null,
    chainId: null,
    currencySymbol: '---',
    blockExplorerUrl: null
  })

  useEffect(() => {
    const load = async () => {
      const providerUrl = await storage.setting.get.ethereumProvider()
      const metadata = await getEthNetworkMetadata(providerUrl)
      if (metadata) {
        setEvmNetworkMetadata(metadata)
      }
    }

    load()
  }, [])

  return { evmNetworkMetadata }
}
