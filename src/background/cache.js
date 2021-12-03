class Cache {
  #generatedKey
  #contentScriptPort

  constructor(generatedKey, contentScriptPort) {
    this.#generatedKey = generatedKey
    this.#contentScriptPort = contentScriptPort
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
}


export default new Cache(
  { key: null, mnemonic: null, type: null, address: null },
  { port: null, id: null }
) 
