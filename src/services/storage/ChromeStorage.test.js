import sinon from 'sinon'

import { ChromeStorage } from './ChromeStorage'

describe('ChromeStorage class', () => {
  let chromeStorage

  const TEST_KEY = 'user'
  const TEST_VALUE = ['userOne', 'userTwo']

  beforeAll(async () => {
    chromeStorage = new ChromeStorage()
    await chromeStorage._setChrome(TEST_KEY, TEST_VALUE)
  })

  afterAll(async () => {
    await chrome.storage.local.clear()
  })

  describe('Get method', () => {
    describe('Failed to get data', () => {
      it('returns null when receive non-string input', async () => {
        const result = await chromeStorage._getChrome([])
        expect(result).toBe(null)
      })
  
      it('returns null when key not match', async () => {
        const result = await chromeStorage._getChrome('non_existing_key')
        expect(result).toBe(null)
      })

      it('returns null when chrome api throws an error', async () => {
        const stub = sinon.stub(chrome.storage.local, 'get').throws()
        const result = await chromeStorage._getChrome()
        expect(result).toBe(null)

        stub.restore()
      }) 
    })

    describe('Succeeded to get data', () => {
      it ('gets correct data', async () => {
        const result = await chromeStorage._getChrome(TEST_KEY)
        expect(result).toEqual(TEST_VALUE)
      })
    })
  
  })

  describe('Set method', () => {
    describe('Failed to set data', () => {
      it('skips when receive invalid input', async () => {
        const invalidKey = []
        const value = 1

        await chromeStorage._setChrome(invalidKey, value)
        const result = await chromeStorage._getChrome(invalidKey)
        expect(result).toBe(null)
      })
    })

    describe('Succeeded to set data', () => {
      it('sets correct data', async () => {
        const newKey = 'new_key'
        const newValue = 'new_value'
  
        await chromeStorage._setChrome(newKey, newValue)
        const result = await chromeStorage._getChrome(newKey)
  
        expect(result).toEqual(newValue)
      })
    })
  })

  describe('Remove method', () => {
    it('removes correct key', async () => {
      let result = await chromeStorage._getChrome(TEST_KEY)

      expect(result).toEqual(TEST_VALUE)

      await chromeStorage._removeChrome(TEST_KEY)
      result = await chromeStorage._getChrome(TEST_KEY)

      expect(result).toEqual(null)
    })
  })
})
