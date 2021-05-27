const MOCK_AMOUNT = 100
const MOCK_ADDRESS = '123456789012345678901234567890123456789012'
const MOCK_PHASE = '1 2 3 4 5 6 7 8'
const MOCK_KEY = 'ajsdaskdjsdhkashdj'

export class Web {
  constructor() {
    this.balance = MOCK_AMOUNT
    this.address = MOCK_ADDRESS
    this.wallet = null
  }

  loadWallet(data) {
    this.wallet = data
    this.balance = MOCK_AMOUNT
    this.address = MOCK_ADDRESS
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.wallet)
      }, 2000)
    })
  }

  generateWallet() {
    this.mnemonic = MOCK_PHASE
    this.address = MOCK_ADDRESS
    this.wallet = MOCK_KEY
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, 3000)
    })
  }

  myContent() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          {
            title: 'title 1',
            ticker: 'KOINFT',
            totalReward: 1000,
            txIdContent: 'txId 1',
          },
          {
            title: 'title 2',
            ticker: 'KOINFT2',
            totalReward: 2000,
            txIdContent: 'txId 2',
          }
        ])
      }, 3000)
    })
  }

  getKoiBalance() {
    return Promise.resolve(this.balance)
  }

  transfer() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`txId-${Date.now()}`)
      }, 1000)
    })
  }

  getWalletBalance() {
    return Promise.resolve(this.balance)
  }
}
