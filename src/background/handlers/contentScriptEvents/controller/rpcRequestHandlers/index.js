import EventEmitter from 'events'

import ethRequestAccounts from './ethRequestAccounts'
import walletRequestPermissions from './walletRequestPermissions'
import walletGetPermissions from './walletGetPermissions'
import ethAccounts from './ethAccounts'
import getEncryptionPublicKey from './getEncryptionPublicKey'
import ethDecrypt from './ethDecrypt'
import netVersion from './netVersion'
import ethSendTransaction from './ethSendTransaction'

const METHOD = {
  eth_requestAccounts: 'eth_requestAccounts', // connect -> popup
  wallet_requestPermissions: 'wallet_requestPermissions', // request permissions -> popup
  wallet_getPermissions: 'wallet_getPermissions', // get permisisons
  eth_accounts: 'eth_accounts', // get all eth accounts
  eth_getEncryptionPublicKey: 'eth_getEncryptionPublicKey', // param: ['addresses'] get encryption public key -> popup (use this key to encrypt message)
  eth_decrypt: 'eth_decrypt', // params: ['encryptionData', 'selectedAddress'] decrypt message -> popup
  eth_chainId: 'eth_chainId', // get chainId
  net_version: 'net_version', // get networkId
  eth_sendTransaction: 'eth_sendTransaction' // send eth
}

class EthereumRequestHandlers extends EventEmitter {
  constructor() {
    super()
  }

  send(method, payload, tab, next) {
    this.emit(method, payload, tab, next)
  } 
}

const getEthereumRequestHandlers = () => {
  const ethereumRequestHandlers = new EthereumRequestHandlers()

  ethereumRequestHandlers.on(METHOD.eth_requestAccounts, ethRequestAccounts)
  ethereumRequestHandlers.on(METHOD.wallet_requestPermissions, walletRequestPermissions)
  ethereumRequestHandlers.on(METHOD.wallet_getPermissions, walletGetPermissions)
  ethereumRequestHandlers.on(METHOD.eth_accounts, ethAccounts)
  ethereumRequestHandlers.on(METHOD.eth_getEncryptionPublicKey, getEncryptionPublicKey)
  ethereumRequestHandlers.on(METHOD.eth_decrypt, ethDecrypt)
  ethereumRequestHandlers.on(METHOD.net_version, netVersion)
  ethereumRequestHandlers.on(METHOD.eth_sendTransaction, ethSendTransaction)

  return ethereumRequestHandlers
}

export default getEthereumRequestHandlers()
