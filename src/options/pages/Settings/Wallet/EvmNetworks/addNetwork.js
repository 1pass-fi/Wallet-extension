import storage from 'services/storage'

const addNetwork = async () => {
  await storage.setting.update.addedEvmNetwork(currentValue => {
    const polygonNetwork = {
      label: 'Polygon Testnet',
      value: 'https://rpc-mumbai.maticvigil.com/'
    }

    return [...currentValue, polygonNetwork]
  })
  setAdded(true)

  await dispatch(loadAllAccounts())
}
