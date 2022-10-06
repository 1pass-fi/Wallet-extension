import connect from './connect'
import createDID from './createDID'
import createTransaction from './createTransaction'
import disconnect from './disconnect'
import ethereumRpcRequest from './ethereumRpcRequest'
import getAddress from './getAddress'
import getAllAddresses from './getAllAddresses'
import getPermission from './getPermission'
import getPublicKey from './getPublicKey'
import getWalletName from './getWalletName'
import k2Connect from './k2Connect'
import k2Disconnect from './k2Disconnect'
import k2SignAndSendTransaction from './k2SignAndSendTransaction'
import k2SignMessage from './k2SignMessage'
import k2SignTransaction from './k2SignTransaction'
import koiConnect from './koiConnect'
import koiCreateTransaction from './koiCreateTransaction'
import koiDisconnect from './koiDisconnect'
import koiGetAddress from './koiGetAddress'
import koiGetPermission from './koiGetPermission'
import koiRegisterData from './koiRegisterData'
import koiSendKoi from './koiSendKoi'
import koiSignPort from './koiSignPort'
import signArweaveTransaction from './signArweaveTransaction'
import signature from './signature'
import solanaCheckConnection from './solanaCheckConnection'
import solanaConnect from './solanaConnect'
import solanaDisconnect from './solanaDisconnect'
import solanaSignAllTransactions from './solanaSignAllTransactions'
import solanaSignAndSendTransaction from './solanaSignAndSendTransaction'
import solanaSignMessage from './solanaSignMessage'
import solanaSignTransaction from './solanaSignTransaction'
import testEthereum from './testEthereum'
import updateDID from './updateDID'

export default {
  koiConnect,
  connect,
  getAddress,
  koiGetAddress,
  getAllAddresses,
  getPermission,
  koiGetPermission,
  createTransaction,
  koiCreateTransaction,
  disconnect,
  koiDisconnect,
  getWalletName,
  koiRegisterData,
  getPublicKey,
  koiSignPort,
  koiSendKoi,
  createDID,
  updateDID,
  signature,
  ethereumRpcRequest,
  signArweaveTransaction,
  testEthereum,
  solanaConnect,
  solanaDisconnect,
  solanaSignAllTransactions,
  solanaSignTransaction,
  solanaSignMessage,
  solanaSignAndSendTransaction,
  solanaCheckConnection,
  k2Connect,
  k2Disconnect,
  k2SignAndSendTransaction,
  k2SignMessage,
  k2SignTransaction
}
