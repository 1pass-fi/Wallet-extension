const MOCK_AMOUNT = 100
const MOCK_ADDRESS = '123456789012345678901234567890123456789012'
const MOCK_PHASE = 'faculty photo tornado doll matrix bench thumb team move diesel room tube'

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
    return Promise.resolve(this.wallet)
  }

  generateWallet() {
    this.mnemonic = MOCK_PHASE
    return Promise.resolve({})
  }

  myContent() {
    return Promise.resolve([
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
  }

  getKoiBalance() {
    return Promise.resolve(this.balance)
  }

  transfer() {
    return Promise.resolve(`txId-${Date.now()}`)
  }

  getWalletBalance() {
    return Promise.resolve(this.balance)
  }
}
