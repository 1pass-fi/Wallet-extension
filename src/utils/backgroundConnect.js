import { MESSAGES, LONG_LIVED_HANDLER } from 'koiConstants'

export class EventHandler {
  constructor(type, callback) {
    this.type = type
    this.callback = callback
  }
}

export class BackgroundConnect {
  constructor(portName) {
    try {
      this.eventHandlers = []
      /* istanbul ignore next */
      this.port = chrome.runtime.connect({ name: portName })
      /* istanbul ignore next */
      this.port.onMessage.addListener((message) => {
        const _this = this
        this.eventHandlers.forEach(handler => {
          if (handler.type === message.type) {
            handler.callback(message)
            !LONG_LIVED_HANDLER.includes(handler.type) && _this.removeHandler(handler.type)
          }
        })
      })
    } catch (error) {
      /* istanbul ignore next */
      console.error('Cannot connect---', error)
    }
  }
  /* istanbul ignore next */
  postMessage(message) {
    if (!this.port) return
    this.port.postMessage(message)
  }

  addHandler(aHandler) {
    if (this.eventHandlers.every(handler => handler.type !== aHandler.type)) {
      this.eventHandlers.push(aHandler)
    }
  }

  request(type, callback, data) {
    const newRequest = new EventHandler(type, callback, data)
    this.addHandler(newRequest)
    this.postMessage({
      type,
      data
    })
  }

  removeHandler(handlerType) {
    this.eventHandlers = this.eventHandlers.filter(handler => handler.type !== handlerType)
  }
}
