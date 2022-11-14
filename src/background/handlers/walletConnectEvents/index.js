import { ETH_MESSAGE } from 'constants/koiConstants'

// controller
import controller from './controller'
import WalletConnectEvents from './WalletConnectEvents'

const getEmitter = () => {
  const walletConnectEvents = new WalletConnectEvents()

  walletConnectEvents.on(ETH_MESSAGE.SIGN_TRANSACTION, controller.ethSignTransaction)

  return walletConnectEvents
}

export default getEmitter()
