import { useEffect, useState } from 'react'
import { get } from 'lodash'
import { isArweaveAddress } from 'utils'

const useExploreBlock = ({ transactionPayload }) => {
  const [exploreBlockUrl, setExploreBlockUrl] = useState('')

  useEffect(() => {
    const load = async () => {
      const sender = get(transactionPayload, 'from')
      if (isArweaveAddress(sender)) {
        return setExploreBlockUrl('http://viewblock.io/arweave/tx')
      }
    }

    if (transactionPayload) load()
  }, [transactionPayload])

  return { exploreBlockUrl }
}

export default useExploreBlock
