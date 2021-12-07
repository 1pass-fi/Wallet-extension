class Cache {
  #generatedKey
  #contentScriptPort
  #popupPorts

  constructor(generatedKey, contentScriptPort, popupPorts) {
    this.#generatedKey = generatedKey
    this.#contentScriptPort = contentScriptPort
    this.#popupPorts = popupPorts
  }

  getGeneratedKey() {
    return this.#generatedKey
  }

  setGeneratedKey(generatedKey) {
    this.#generatedKey = generatedKey
  }

  getContentScriptPort() {
    return this.#contentScriptPort
  }

  setContentScriptPort(contentScriptPort) {
    this.#contentScriptPort = contentScriptPort
  }

  getPopupPorts() {
    return this.#popupPorts
  }

  setPopupPorts(popupPorts) {
    this.#popupPorts = popupPorts
  }

  addPopupPort(port) {
    this.#popupPorts.push(port)
  }

  removePopupPort(port) {
    for (let i = 0; i < this.#popupPorts.length; i++) {
      if (port.name === this.#popupPorts[i].name) {
        this.#popupPorts.splice(i, 1)
        break
      }
    }
  }
}


export default new Cache(
  { key: null, mnemonic: null, type: null, address: null },
  { port: null, id: null },
  []
) 
