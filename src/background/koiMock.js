import { PATH } from 'constants/koiConstants'
const MOCK_ADDRESS = '123456789012345678901234567890123456789012'
const MOCK_PHASE = '1faculty 2photo 3tornado 4doll 5matrix 6bench 7thumb 8team 9move 10diesel 11room 12tube'
const MOCK_KEY = 'ajsdaskdjsdhkashdj'
const CONTENTS = require('./mockContent.json')
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

export class Web {
  constructor() {
    this.address = null
    this.wallet = null
    this.mockArBalance = Math.random() * 100
    this.mockKoiBalance = Math.random() * 100
    this.mockAxios = new MockAdapter(axios)

    this.mockAxios.onGet(PATH.ALL_CONTENT).reply( () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([200, CONTENTS.map(item => ({[item.txIdContent.slice(1)]: item}))])
        }, 2000)
      })
    })
    this.mockAxios.onGet(/https:\/\/bundler.openkoi.com:8888\/state\/getNFTState\?tranxId=.+/).reply(config => {
      const id = config.url.split(`${PATH.SINGLE_CONTENT}/`)[1]
      return [200, CONTENTS.filter(item => item.txIdContent === `/${id}`)[0]]
    })

    this.mockAxios.onGet('http://placeimg.com/100/100/any').passThrough()

    this.mockAxios.onGet(/https:\/\/arweave.net\/.+/).reply(async () => {
      const data = (await axios.get('http://placeimg.com/100/100/any', { responseType: 'arraybuffer'})).data
      return [200, data]
    })
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
