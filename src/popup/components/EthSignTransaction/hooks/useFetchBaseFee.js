import React, { useEffect, useState } from 'react'
import storage from 'services/storage'
import ethereumUtils from 'utils/ethereumUtils'

const useFetchBaseFee = () => {
  const [baseFee, setBaseFee] = useState(null)

  useEffect(() =>   {
    const getFee = async () => {
      try {
        const providerUrl = await storage.setting.get.ethereumProvider()
        const { ethersProvider } = ethereumUtils.initEthersProvider(providerUrl)
        const baseFee = (await ethersProvider.getBlock('latest')).baseFeePerGas
        setBaseFee(baseFee.toNumber())
      } catch (err) {
        console.error(err)
        setBaseFee(null)
      }
    }

    getFee()
    const getFeeInterval = setInterval(() => {
      getFee()
    }, 3000)

    return () => {
      clearImmediate(getFeeInterval)
    }
  }, [])

  return { baseFee }
}

export default useFetchBaseFee
