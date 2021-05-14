import { PORTS } from 'constant'

export class EventHandler {
  constructor(type, callback) {
    this.type = type
    this.callback = callback
  }
}

export class BackgroundConnect {
  constructor() {
    console.log('BackgroundConnect--init')
    this.port = chrome.runtime.connect({ name: 'POPUP' })
    this.eventHandlers = []
    this.port.onMessage.addListener((message, sender) => {
      this.eventHandlers.forEach(handler => {
        if (handler.type === message.type) {
          handler.callback(message)
        }
      })
    })
  }

  postMessage(message) {
    if (!this.port) return
    this.port.postMessage(message)
  }

  addHandler(handler) {
    this.eventHandlers.push(handler)
  }

  removeHandler(aHandler) {
    this.eventHandlers = this.eventHandlers.filter(handler => handler !== aHandler)
  }
}
