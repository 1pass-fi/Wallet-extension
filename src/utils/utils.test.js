import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import {
  loadWallet,
  generateWallet,
  loadMyContent,
  transfer,
  getBalances, 
  numberFormat,
  fiatCurrencyFormat
} from './index'

import { LOAD_KOI_BY, ERROR_MESSAGE, PATH } from 'koiConstants'

describe('Tests for utils', () => {
  let koiObj, initKoiObj, mock
  const koiBalance = 100
  const arBalance = 50

  beforeEach(() => {
    mock = new MockAdapter(axios)
    initKoiObj = {
      address: '',
      mnemonic: '',
      loadWallet: async () => koiObj.address = 'address',
      getWalletBalance: () => Promise.resolve(arBalance),
      getKoiBalance: () => Promise.resolve(koiBalance),
      generateWallet: async () => koiObj.mnemonic = 'seedPhrase'
    }

    koiObj = { ...initKoiObj }
  })

  afterEach(() => {
    koiObj = { ...initKoiObj }
    mock.reset()
  })

  describe('Test for getBalances()', () => {
    it('returns balancesData as expected', async () => {
      const balancesData = await getBalances(koiObj)

      expect(balancesData).toEqual({
        arBalance: arBalance,
        koiBalance: koiBalance
      })
    })
  })

  describe('Test for loadWallet()', () => {
    describe('loadWallet by address', () => {
      it('returns koiData as expected', async () => {
        const koiData = await loadWallet(koiObj, 'address', LOAD_KOI_BY.ADDRESS)

        expect(koiData).toEqual({
          address: 'address'
        })
      })
    })

    describe('loadWallet by key', () => {
      it('returns koiData as expected', async () => {
        const koiData = await loadWallet(koiObj, 'address', LOAD_KOI_BY.KEY)

        expect(koiData).toEqual({
          address: 'address'
        })
      })
    })
  })


  describe('Test for generateWallet()', () => {
    it('return seedPhrase', async () => {
      const seedPhrase = await generateWallet(koiObj)

      expect(seedPhrase).toEqual('seedPhrase')
    })
  })

  describe('Test for loadMyContent()', () => {
    let allContent, contentOne, contentTwo, contentThree

    beforeEach(() => {
      koiObj.address = 'address'
      allContent = [
        {
          txId1: {
            txIdContent: 'txId1',
            owner: 'address'
          }
        },
        {
          txId2: {
            txIdContent: 'txId2',
            owner: 'address'
          }
        },
        {
          txId3: {
            txIdContent: 'txId2',
            owner: 'another-address'
          }
        }
      ]
      
      contentOne = {
        title: 'title 1',
        ticker: 'KOINFT',
        totalReward: 1000,
        txIdContent: 'txId1'
      }

      contentTwo = {
        title: 'title 2',
        ticker: 'ANOTHER',
        totalReward: 2000,
        txIdContent: 'txId2'
      }

      contentThree = {
        title: 'title 3',
        ticker: 'KOINFT',
        totalReward: 3000,
        txIdContent: 'txId3'
      }

      const url = PATH.ALL_CONTENT
      const contentOneUrl = `${PATH.SINGLE_CONTENT}/txId1`
      const contentTwoUrl = `${PATH.SINGLE_CONTENT}/txId2`
      const contentThreeUrl = `${PATH.SINGLE_CONTENT}/txId3`

      mock.onGet(url).reply(200, allContent)
      mock.onGet(contentOneUrl).reply(200, contentOne)
      mock.onGet(contentTwoUrl).reply(200, contentTwo)
      mock.onGet(contentThreeUrl).reply(200, contentThree)
    })

    it('return list of content', async () => {
      const resultList = await loadMyContent(koiObj)

      expect(resultList).toEqual([
        {
          name: 'title 1',
          isKoiWallet: true,
          earnedKoi: 1000,
          txId: 'txId1',
          imageUrl: `${PATH.NFT_IMAGE}txId1`,
          galleryUrl: `${PATH.GALLERY}?id=txId1`,
          koiRockUrl: `${PATH.KOI_ROCK}txId1`,
          isRegistered: true
        },
        {
          name: 'title 2',
          isKoiWallet: false,
          earnedKoi: 2000,
          txId: 'txId2',
          imageUrl: `${PATH.NFT_IMAGE}txId2`,
          galleryUrl: `${PATH.GALLERY}?id=txId2`,
          koiRockUrl: `${PATH.KOI_ROCK}txId2`,
          isRegistered: true
        }
      ])
    })
  })


  describe('Test for transfer()', () => {
    beforeEach(() => {
      koiObj.transfer = async () => 'txId'
      koiObj.Balance = async () => 1
    })

    describe('Have enough Koi', () => {
      it('returns transaction id', async () => {
        const txId = await transfer(koiObj, 1, 'address')

        expect(txId).toEqual('txId')
      })
    })

    describe('Not enough Koi', () => {
      it('throws error', async () => {
        try {
          await transfer(koiObj, 2, 'address')
        } catch (err) {
          expect(err.message).toEqual(ERROR_MESSAGE.NOT_ENOUGH_KOI)
        }
      })
    })
  })
})

describe('test for numberFormatter', () => {
  it('returns string with correct format', () => {
    expect(numberFormat(null)).toEqual('---')
    expect(numberFormat(12345.678)).toEqual('12,345.678')
  })
})

describe('test for fiatCurrencyFormat', () => {
  it('returns string with correct format', () => {
    expect(fiatCurrencyFormat(null)).toEqual('---')
    expect(fiatCurrencyFormat(12345.678)).toEqual('12,345.68')
  })
})
