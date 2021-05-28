const MOCK_ADDRESS = '123456789012345678901234567890123456789012'
const MOCK_PHASE = 'faculty photo tornado doll matrix bench thumb team move diesel room tube'
const MOCK_KEY = 'ajsdaskdjsdhkashdj'

export class Web {
  constructor() {
    this.address = null
    this.wallet = null
    this.mockArBalance = Math.random() * 100
    this.mockKoiBalance = Math.random() * 100
  }

  loadWallet(data) {
    this.wallet = data
    this.address = MOCK_ADDRESS
    return Promise.resolve(this.wallet)
  }

  generateWallet() {
    this.mnemonic = MOCK_PHASE
    this.address = MOCK_ADDRESS
    this.wallet = MOCK_KEY
    return Promise.resolve(true)
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
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockKoiBalance +=  Math.random() * 10
        resolve(this.mockKoiBalance)
      }, 5000)
    })
  }

  transfer(qty, address) {
    if (qty <= this.mockKoiBalance) {
      this.mockKoiBalance -= qty
    }
    return Promise.resolve(`txId-${Date.now()}`)
  }

  getWalletBalance() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockArBalance +=  Math.random() * 10
        resolve(this.mockArBalance)
      }, 5000)
    })
  }
}
