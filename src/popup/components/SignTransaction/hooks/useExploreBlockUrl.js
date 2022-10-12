import { useEffect, useState } from 'react'
import { ETH_NETWORK_PROVIDER } from 'constants/koiConstants'
import { get } from 'lodash'
import storage from 'services/storage'
import { isArweaveAddress, isEthereumAddress } from 'utils'

const useExploreBlock = ({ transactionPayload }) => {
  const [exploreBlockUrl, setExploreBlockUrl] = useState('')

  useEffect(() => {
    const load = async () => {
      const sender = get(transactionPayload, 'from')
      if (isArweaveAddress(sender)) {
        return setExploreBlockUrl('http://viewblock.io/arweave/tx')
      }

      if (isEthereumAddress(sender)) {
        const provider = await storage.setting.get.ethereumProvider()
        if (provider === ETH_NETWORK_PROVIDER.MAINNET) {
          return setExploreBlockUrl('https://etherscan.io/tx')
        }
        if (provider === ETH_NETWORK_PROVIDER.GOERLI) {
          return setExploreBlockUrl('https://goerli.etherscan.io/tx')
        }
      }
    }

    if (transactionPayload) load()
  }, [transactionPayload])

  return { exploreBlockUrl }
}

export default useExploreBlock
