import { useEffect } from 'react'
import axios from 'axios'
import { get, isNumber } from 'lodash'

// services
import storage from 'services/storage'

const usePrice = ({ setCurrency, setPrice, setError }) => {
  const loadPrice = async () => {
    try {
      const price = await storage.generic.get.tokenPrice()
      let selectedCurrency = (await storage.setting.get.selectedCurrency()) || 'USD'

      const { AR, ETH, SOL } = price || { AR: 1, ETH: 1, SOL: 1 }

      setPrice({ AR, ETH })
      setCurrency(selectedCurrency)

      const { data: responseData } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=${selectedCurrency}`
      )

      const arPrice = get(responseData, `arweave.${selectedCurrency.toLowerCase()}`)

      const { data: ethRes } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${selectedCurrency}`
      )
      const ethPrice = get(ethRes, `ethereum.${selectedCurrency.toLowerCase()}`)

      const { data: solRes } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=${selectedCurrency}`
      )
      const solPrice = get(solRes, `solana.${selectedCurrency.toLowerCase()}`)

      if (isNumber(arPrice) && isNumber(arPrice)) {
        await setPrice({ AR: arPrice, ETH: ethPrice, SOL: solPrice })
        await storage.generic.set.tokenPrice({
          ...price,
          AR: arPrice,
          ETH: ethPrice,
          SOL: solPrice
        })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadPrice()
  }, [])
}

export default usePrice
