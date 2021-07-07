export class Request {
  constructor(backgroundConnect) {
    this.backgroundConnect = backgroundConnect
  }

  promise (messageType, body) {
    return new Promise((resolve, reject) => {
      this.backgroundConnect.request(messageType, response => {
        console.log('RESPONSE FROM BACKGROUND: ', response)
        if (response.error) {
          reject({ message: response.error })
        }
        resolve(response.data)
      }, body)
    })
  }
}
