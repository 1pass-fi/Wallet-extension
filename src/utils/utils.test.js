import '@babel/polyfill'
import { LOAD_KOI_BY, PATH } from 'koiConstants'
import {
  loadWallet,
  generateWallet,
  loadMyContent,
  transfer,
  getBalances
} from './index'

describe('Tests for utils', () => {
  let koiObj, initKoiObj
  const koiBalance = 100
  const arBalance = 50

  beforeEach(() => {
    initKoiObj = {
      address: '',
      mnemonic: '',
      loadWallet: async () => koiObj.address = 'address',
      getWalletBalance: () => Promise.resolve(arBalance),
      getKoiBalance: () => Promise.resolve(koiBalance),
      generateWallet: async () => koiObj.mnemonic = 'seedPhrase'
    }

    koiObj = {...initKoiObj }
  })

  afterEach(() => {
    koiObj = { ...initKoiObj }
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
    let returnedContentList

    beforeEach(() => {
      returnedContentList = [
        {
          title: 'title 1',
          ticker: 'KOINFT',
          totalReward: 1000,
          txIdContent: 'txId 1',
        },
        {
          title: 'title 2',
          ticker: 'ARNFT',
          totalReward: 2000,
          txIdContent: 'txId 2',
        }
      ]

      koiObj.myContent = async () => returnedContentList
    })

    it('return list of content', async () => {
      const resultList = await loadMyContent(koiObj)

      expect(resultList).toEqual([
        {
          name: 'title 1',
          isKoiWallet: true,
          earnedKoi: 1000,
          txId: 'txId 1',
          imageUrl: `${PATH.NFT_IMAGE}/txId 1`,
          galleryUrl: `${PATH.GALLERY}?id=txId 1`,
          koiRockUrl: `${PATH.KOI_ROCK}/txId 1`,
          isRegistered: true
        },
        {
          name: 'title 2',
          isKoiWallet: false,
          earnedKoi: 2000,
          txId: 'txId 2',
          imageUrl: `${PATH.NFT_IMAGE}/txId 2`,
          galleryUrl: `${PATH.GALLERY}?id=txId 2`,
          koiRockUrl: `${PATH.KOI_ROCK}/txId 2`,
          isRegistered: true
        }
      ])
    })
  })


  describe('Test for transfer()', () => {
    beforeEach(() => {
      koiObj.transfer = async () => 'txId'
    })

    it('returns transaction id', async () => {
      const txId = await transfer(koiObj, 1, 'address')

      expect(txId).toEqual('txId')
    })
  })

  // describe('Test for JSONFileToObject()', () => {
  //   it('returns object from json', async () => {
  //     const file = new File([`{ "key": "value" }`], 'file.json')
  //     const returnedObj = await JSONFileToObject(file)

  //     expect(returnedObj).toEqual({ "key": "value" })
  //   })
  // })
})
