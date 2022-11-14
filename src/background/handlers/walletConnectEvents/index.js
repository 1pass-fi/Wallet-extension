import { ETH_MESSAGE } from 'constants/koiConstants'

// controller
import controller from './controller'
import WalletConnectEvents from './WalletConnectEvents'

const getEmitter = () => {
  const walletConnectEvents = new WalletConnectEvents()

  walletConnectEvents.on(ETH_MESSAGE.SIGN_TRANSACTION, controller.ethSignTransaction)
  walletConnectEvents.on(ETH_MESSAGE.SEND_TRANSACTION, controller.ethSendTransaction)
  walletConnectEvents.on(ETH_MESSAGE.PERSONAL_SIGN, controller.personalSign)
  walletConnectEvents.on(ETH_MESSAGE.SIGN_TYPED_DATA, controller.ethSignTypedData)

  return walletConnectEvents
}

export default getEmitter()
