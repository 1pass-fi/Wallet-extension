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
  const finnieSolanaWalletProvider = new FinnieSolanaProvider(window.connection)
  const finnieK2WalletProvider = new FinnieK2Provider(window.connection)

  window.addEventListener('chainChanged', function() {
    finnieEthereumProvider.request({ method: 'eth_chainId' }).then(chainId => {
      finnieEthereumProvider.emit('chainChanged', chainId)
    })
    finnieEthereumProvider.emit('chainChanged')
  })
  window.addEventListener('networkChanged', function() {
    finnieEthereumProvider.request({ method: 'net_version' }).then(netVersion => {
      finnieEthereumProvider.emit('networkChanged', netVersion)
    })
  })
  window.addEventListener('accountsChanged', function() {
    finnieEthereumProvider.request({ method: 'eth_accounts' }).then(accounts => {
      finnieEthereumProvider.emit('accountsChanged', accounts)
    })
  })

  if (window.ethereum === undefined) window.ethereum = finnieEthereumProvider

  window.ethereum = finnieEthereumProvider
  window.arweaveWallet = finnieArweaveProvider
  window.koiiWallet = finnieKoiiWalletProvider
  window.koiWallet = finnieKoiiWalletProvider
  window.solana = finnieSolanaWalletProvider
  window.k2 = finnieK2WalletProvider
  // window.solana.checkConnection()
}

// const arweaveWalletExcluded = () => {
//   window.connection = new FinnieRpcConnection()

//   window.addEventListener('message', function(event) {
//     window.connection.emit(event.data.type + '_' + event.data.id, event.data)
//   })

//   const finnieKoiiWalletProvider = new FinnieKoiiWalletProvider(window.connection)

//   window.koiiWallet = finnieKoiiWalletProvider
// }

// export default (disabledArweave) => {
//   if (disabledArweave) return arweaveWalletExcluded
//   else return mainScript
// }

mainScript()