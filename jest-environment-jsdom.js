'use strict'

const JSDOMEnvironment = require('jest-environment-jsdom')

class MyEnvironment extends JSDOMEnvironment {
  constructor(config, context) {
    // const projectConfig = Object.assign({}, config.projectConfig, {
    //   globals: Object.assign({}, config.projectConfig.globals, {
    //     Uint32Array: Uint32Array,
    //     Uint8Array: Uint8Array,
    //     ArrayBuffer: ArrayBuffer
    //   })
    // })
    // super({ ...config, projectConfig })
    
    super(config, context)
    console.log('config', config)
  }

  async setup() {}

  async teardown() {}
}

module.exports = MyEnvironment
