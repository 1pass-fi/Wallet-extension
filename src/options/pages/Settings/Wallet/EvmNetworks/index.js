import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import BnbLogo from 'img/bnb-logo.svg'
import { loadAllAccounts } from 'options/actions/accounts'
import storage from 'services/storage'
import reloadGalleryPage from 'utils/reloadGalleryPage'


const PolygonTestnet = () => {
  const dispatch = useDispatch()
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

    await dispatch(loadAllAccounts())
  }

  const removeNetwork = async () => {
    let addedNetworks = await storage.setting.get.addedEvmNetworks()

    addedNetworks = addedNetworks.filter(network => {
      return  network.label !== 'Polygon Testnet'
    })
    await storage.setting.set.addedEvmNetworks(addedNetworks)

    await storage.setting.set.ethereumProvider('https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2')
    await dispatch(loadAllAccounts())
    reloadGalleryPage()
  }

  return (
    <div className='flex w-full justify-between mb-6'>
      <div className='flex'>
        <BnbLogo />
        <div className='ml-4 text-sm'>Polygon Testnet</div>
      </div>
      {!added ? 
        <div onClick={addNetwork} className='text-sm font-semibold text-turquoiseBlue underline cursor-pointer'>
          Add Network
        </div> :
        <div onClick={removeNetwork} className='text-sm font-semibold text-turquoiseBlue underline cursor-pointer'>
          Remove Network
        </div>
      }
    </div>
  )
}

const PolygonMainnet = () => {
  const dispatch = useDispatch()
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const load = async () => {
      const addedNetworks = await storage.setting.get.addedEvmNetworks()
      const isAdded = !addedNetworks.every(network => network.label !== 'Polygon')
      setAdded(isAdded)
    }

    load()
  }, [])

  const addNetwork = async () => {
    let addedNetworks = await storage.setting.get.addedEvmNetworks()
    const polygonNetwork = {
      label: 'Polygon',
      value: 'https://polygon-rpc.com/'
    }
    
    addedNetworks = [...addedNetworks, polygonNetwork]

    await storage.setting.set.addedEvmNetworks(addedNetworks)
    setAdded(true)

    await dispatch(loadAllAccounts())
  }

  const removeNetwork = async () => {
    let addedNetworks = await storage.setting.get.addedEvmNetworks()

    addedNetworks = addedNetworks.filter(network => {
      return  network.label !== 'Polygon'
    })
    await storage.setting.set.addedEvmNetworks(addedNetworks)
    await storage.setting.set.ethereumProvider('https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2')
    reloadGalleryPage()
  }

  return (
    <div className='flex w-full justify-between mb-6'>
      <div className='flex'>
        <BnbLogo />
        <div className='ml-4 text-sm'>Polygon</div>
      </div>
      {!added ? 
        <div onClick={addNetwork} className='text-sm font-semibold text-turquoiseBlue underline cursor-pointer'>
          Add Network
        </div> :
        <div onClick={removeNetwork} className='text-sm font-semibold text-turquoiseBlue underline cursor-pointer'>
          Remove Network
        </div>
      }
    </div>
  )
}

const EvmNetworks = () => {
  return (
    <div>
      <PolygonTestnet />
      <PolygonMainnet />
    </div>
  )
}

export default EvmNetworks
