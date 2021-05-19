export class EventHandler {
  constructor(type, callback) {
    this.type = type
    this.callback = callback
  }
}

export class BackgroundConnect {
  constructor(portName) {
    console.log('BackgroundConnect--init')
    try {
      this.eventHandlers = []
      this.port = chrome.runtime.connect({ name: portName })

      this.port.onMessage.addListener((message, sender) => {
        this.eventHandlers.forEach(handler => {
          if (handler.type === message.type) {
            handler.callback(message)
          }
        })
      })
    } catch (error) {
      console.error('Cannot connect---', error)
    }
  }

  postMessage(message) {
    if (!this.port) return
    this.port.postMessage(message)
  }

  addHandler(aHandler) {
    if (this.eventHandlers.every(handler => handler.type !== aHandler.type)) {
      this.eventHandlers.push(aHandler)
    }
  }

  removeHandler(handlerType) {
    this.eventHandlers = this.eventHandlers.filter(handler => handler.type !== handlerType)
  }
}
