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

      console.log('Selected Currency: ', selectedCurrency)

      const { AR, ETH } = price || 1

      setPrice({ AR, ETH })
      setCurrency(selectedCurrency)

      const { data: responseData } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=${selectedCurrency}`
      )
      console.log('currency: ', selectedCurrency)
      console.log('price', responseData)

      const arPrice = get(responseData, `arweave.${selectedCurrency.toLowerCase()}`)

      const { data: ethRes } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${selectedCurrency}`
      )
      const ethPrice = get(ethRes, `ethereum.${selectedCurrency.toLowerCase()}`)

      if (isNumber(arPrice) && isNumber(arPrice)) {
        await setPrice({ AR: arPrice, ETH: ethPrice })
        await storage.generic.set.tokenPrice({ ...price, AR: arPrice, ETH: ethPrice })
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
