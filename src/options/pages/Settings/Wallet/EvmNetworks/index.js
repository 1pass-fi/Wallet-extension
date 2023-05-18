import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { disable } from 'colors'
import { PREDEFINED_EVM_NETWORK_METADATA } from 'constants/koiConstants'
import EvmLogo from 'img/evm-logo.svg'
import PolygonLogo from 'img/polygon-logo.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'
import get from 'lodash/get'
import { loadAllAccounts } from 'options/actions/accounts'
import { setWalletLoaded } from 'options/actions/walletLoaded'
import { GalleryContext } from 'options/galleryContext'
import storage from 'services/storage'
import reloadGalleryPage from 'utils/reloadGalleryPage'

const useNetworkIcon = ({ networkPayload }) => {
  const icon = useMemo(() => {
    if (networkPayload) {
      const networkName = get(networkPayload, 'label')
      switch (networkName) {
        case 'Polygon Testnet':
          return <PolygonLogo />
        case 'Polygon':
          return <PolygonLogo />
        case 'ETH Mainnet':
          return <EthLogo />
        case 'Goerli Testnet':
          return <EthLogo />
      }
    }
    return <EvmLogo />
  }, [networkPayload])

  return icon
}

const EvmNetwork = ({ networkPayload }) => {
  const { setReloadApp } = useContext(GalleryContext)
  const dispatch = useDispatch()

  const [isAdded, setIsAdded] = useState(false)

  const networkIcon = useNetworkIcon({ networkPayload })

  useEffect(() => {
    const load = async () => {
      const addedNetworks = await storage.setting.get.addedEvmNetworks()
      const isAdded = !addedNetworks.every(network => network.label !== get(networkPayload, 'label'))
      setIsAdded(isAdded)
    }
    load()
  }, [])

  const addNetwork = async () => {
    await storage.setting.update.addedEvmNetwork(currentValue => {
      if (!currentValue) currentValue = []
      const payload = {
        label: get(networkPayload, 'label'),
        value: get(networkPayload, 'value')
      }

      return [...currentValue, payload]
    })

    setReloadApp(false)
    setReloadApp(true)
    setIsAdded(true)
  }

  const removeNetwork = async () => {
    await storage.setting.update.addedEvmNetwork(currentValue => {
      return currentValue.filter(network => {
        return get(network, 'label') !== get(networkPayload, 'label')
      })
    })

    await storage.setting.set.ethereumProvider('https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2')

    setReloadApp(false)
    setReloadApp(true)
    setIsAdded(false)
  }

  const isEth = useMemo(() => {
    const networkName = get(networkPayload, 'label')
    return networkName === 'ETH Mainnet' || networkName === 'Goerli Testnet'
  }, [])

  return (
    <div className='flex w-full justify-between mb-6'>
      <div className='flex'>
        <div style={{width:'20px',height:'20px'}}>{ networkIcon }</div>
        <div className='ml-4 text-sm'>{get(networkPayload, 'label')}</div>
      </div>
      {!isEth && (!isAdded ? 
        <div onClick={addNetwork} className='text-sm font-semibold text-turquoiseBlue underline cursor-pointer'>
          Add Network
        </div> :
        <div onClick={removeNetwork} className='text-sm font-semibold text-turquoiseBlue underline cursor-pointer'>
          Remove Network
        </div>)
      }
    </div>
  )
}

const EvmNetworks = () => {
  const { reloadApp } = useContext(GalleryContext)
  const [networks, setNetworks] = useState([])

  useEffect(() => {
    const loadNetworks = async () => {
      let predefinedNetworks = Object.values({ ...PREDEFINED_EVM_NETWORK_METADATA })
      predefinedNetworks = predefinedNetworks.map(network => {
        return {
          label: get(network, 'networkName'),
          value: get(network, 'rpcUrl')
        }
      })

      let customNetworks = await storage.setting.get.customEvmNetworks()
      customNetworks = Object.values({ ...customNetworks })
      customNetworks = customNetworks.map(network => {
        return {
          label: get(network, 'networkName'),
          value: get(network, 'rpcUrl')
        }
      })

      setNetworks([...predefinedNetworks, ...customNetworks])
    }

    loadNetworks()
  }, [reloadApp])

  return (
    <div>
      {
        networks.map((networkPayload, index) => {
          return <EvmNetwork key={index} networkPayload={networkPayload} />
        })
      }
    </div>
  )
}

export default EvmNetworks
