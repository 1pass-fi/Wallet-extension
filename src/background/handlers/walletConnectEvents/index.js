// controller
import controller from './controller'
import WalletConnectEvents from './WalletConnectEvents'

const getEmitter = () => {
  const walletConnectEvents = new WalletConnectEvents()

  return walletConnectEvents
}

export default getEmitter()
