const MOCK_ADDRESS = '123456789012345678901234567890123456789012'
const MOCK_PHASE = '1faculty 2photo 3tornado 4doll 5matrix 6bench 7thumb 8team 9move 10diesel 11room 12tube'
const MOCK_KEY = 'ajsdaskdjsdhkashdj'
const CONTENTS = require('./mockContent.json')

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
    return Promise.resolve(CONTENTS)
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
