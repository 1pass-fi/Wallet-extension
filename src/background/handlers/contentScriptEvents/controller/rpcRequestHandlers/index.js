import EventEmitter from 'events'

import ethRequestAccounts from './ethRequestAccounts'

const METHOD = {
  eth_requestAccounts: 'eth_requestAccounts'
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

  return ethereumRequestHandlers
}

export default getEthereumRequestHandlers()
