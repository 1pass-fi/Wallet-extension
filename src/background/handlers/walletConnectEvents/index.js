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
  walletConnectEvents.on(ETH_MESSAGE.SIGN_TYPED_DATA_V3, controller.ethSignTypedData)
  walletConnectEvents.on(ETH_MESSAGE.SIGN_TYPED_DATA_V4, controller.ethSignTypedData)
  walletConnectEvents.on(ETH_MESSAGE.SIGN, controller.ethSign)
  walletConnectEvents.on(ETH_MESSAGE.SEND_RAW_TRANSACTION, controller.ethSendRawTransaction)

  return walletConnectEvents
}

export default getEmitter()
