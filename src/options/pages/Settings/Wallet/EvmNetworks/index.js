import React, { useEffect, useState } from 'react'
import BnbLogo from 'img/bnb-logo.svg'
import storage from 'services/storage'

const Bnb = () => {
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const load = async () => {
      const addedNetworks = await storage.setting.get.addedEvmNetworks()
      const isAdded = !addedNetworks.every(network => network.label !== 'Polygon Testnet')
      setAdded(isAdded)
    }

    load()
  }, [])

  const addNetwork = async () => {
    let addedNetworks = await storage.setting.get.addedEvmNetworks()
    const polygonNetwork = {
      label: 'Polygon Testnet',
      value: 'https://rpc-mumbai.maticvigil.com/'
    }
    
    addedNetworks = [...addedNetworks, polygonNetwork]

    await storage.setting.set.addedEvmNetworks(addedNetworks)
    setAdded(true)
  }

  return (
    <div className='flex w-full justify-between mb-6'>
      <div className='flex'>
        <BnbLogo />
        <div className='ml-4 text-sm'>Polygon</div>
      </div>
      {!added && <div onClick={addNetwork} className='text-sm font-semibold text-turquoiseBlue underline cursor-pointer'>
        Add Network
      </div>}
    </div>
  )
}

const EvmNetworks = () => {
  return (
    <div>
      <Bnb />
    </div>
  )
}

export default EvmNetworks
