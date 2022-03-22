/* 
  This script will be injected into client page
*/

const mainScript = () => {
  window.connection = new FinnieRpcConnection()

  window.addEventListener('message', function(event) {
    window.connection.emit(event.data.type + '_' + event.data.id, event.data)
    window.connection.emit(event.data.type, event.data)
  })

  const finnieEthereumProvider = new FinnieEthereumProvider(window.connection)
  const finnieArweaveProvider = new FinnieArweaveProvider(window.connection)
  const finnieKoiiWalletProvider = new FinnieKoiiWalletProvider(window.connection)

  window.addEventListener('chainChanged', function() {
    finnieEthereumProvider.emit('chainChanged')
  })
  window.addEventListener('networkChanged', function() {
    finnieEthereumProvider.emit('networkChanged')
  })
  window.addEventListener('accountsChanged', function() {
    finnieEthereumProvider.emit('accountsChanged')
  })

  window.ethereum = finnieEthereumProvider
  window.arweaveWallet = finnieArweaveProvider
  window.koiiWallet = finnieKoiiWalletProvider
}

const arweaveWalletExcluded = () => {
  window.connection = new FinnieRpcConnection()

  window.addEventListener('message', function(event) {
    window.connection.emit(event.data.type + '_' + event.data.id, event.data)
  })

  const finnieEthereumProvider = new FinnieEthereumProvider(window.connection)
  const finnieKoiiWalletProvider = new FinnieKoiiWalletProvider(window.connection)

  window.ethereum = finnieEthereumProvider
  window.koiiWallet = finnieKoiiWalletProvider
}

export default (disabledArweave) => {
  if (disabledArweave) return arweaveWalletExcluded
  else return mainScript
}
