import { TYPE } from 'constants/accountConstants'
import renderCustomHook from 'testUtils/renderCustomHook'
import { isArweaveAddress, isEthereumAddress, isSolanaAddress } from 'utils'

import useValidate from './useValidate'

/* ERROR MESSAGE */
const INVALID_RECIPIENT = 'Invalid recipient address'
const DEFAULT_ERROR = 'Please fill in all fields'

/* DEFAULT VALUE TO RENDER HOOK */
const renderArgs = {
  selectedToken: {
    logo: 'path',
    balance: 1e18,
    price: 2000,
    name: 'random token',
    symbol: 'RAND',
    decimal: 18
  },
  amount: '0.123',
  recipient: 'recipient_address',
  selectedAccount: {
    id: 'id',
    value: 'value',
    label: 'account_name',
    address: 'address',
    type: 'type'
  },
  alchemyAddress: null
}

/* MOCK FUNCTION AND MODULES */
jest.mock('utils')

describe('useValidate hook', () => {
  /* ETHEREUM */
  describe('Return correct result when validating ethereum address correctly', () => {
    beforeEach(() => {
      renderArgs.selectedAccount.type = TYPE.ETHEREUM
      isEthereumAddress.mockReturnValue(true)
    })

    it('should return true for validated field and null for errorMessage', async () => {
      isEthereumAddress.mockReturnValue(true)
      const result = await renderCustomHook(useValidate, renderArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeTruthy()
      expect(errorMessage).toBeNull()
    })

    it('should return false for validated field and appropriate errorMessage when fail to validate address', async () => {
      isEthereumAddress.mockReturnValue(false)
      const result = await renderCustomHook(useValidate, renderArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeFalsy()
      expect(errorMessage).toBe(INVALID_RECIPIENT)
    })
  })

  /* ARWEAVE*/
  describe('Return correct result when validating arweave address correctly', () => {
    beforeEach(() => {
      renderArgs.selectedAccount.type = TYPE.ARWEAVE
      isArweaveAddress.mockReturnValue(true)
    })

    it('should return true for validated field and null for errorMessage', async () => {
      isArweaveAddress.mockReturnValue(true)
      const result = await renderCustomHook(useValidate, renderArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeTruthy()
      expect(errorMessage).toBeNull()
    })

    it('should return false for validated field and appropriate errorMessage when fail to validate address', async () => {
      isArweaveAddress.mockReturnValue(false)
      const result = await renderCustomHook(useValidate, renderArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeFalsy()
      expect(errorMessage).toBe(INVALID_RECIPIENT)
    })
  })

  /* SOLANA */
  describe('Return correct result when validating solana address correctly', () => {
    beforeEach(() => {
      renderArgs.selectedAccount.type = TYPE.SOLANA
      isSolanaAddress.mockReturnValue(true)
    })

    it('should return true for validated field and null for errorMessage', async () => {
      isSolanaAddress.mockReturnValue(true)
      const result = await renderCustomHook(useValidate, renderArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeTruthy()
      expect(errorMessage).toBeNull()
    })

    it('should return false for validated field and appropriate errorMessage when fail to validate address', async () => {
      isSolanaAddress.mockReturnValue(false)
      const result = await renderCustomHook(useValidate, renderArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeFalsy()
      expect(errorMessage).toBe(INVALID_RECIPIENT)
    })
  })

  /* K2 */
  describe('Return correct result when validating k2 address correctly', () => {
    beforeEach(() => {
      renderArgs.selectedAccount.type = TYPE.K2
      isSolanaAddress.mockReturnValue(true)
    })

    it('should return true for validated field and null for errorMessage', async () => {
      isSolanaAddress.mockReturnValue(true)
      const result = await renderCustomHook(useValidate, renderArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeTruthy()
      expect(errorMessage).toBeNull()
    })

    it('should return false for validated field and appropriate errorMessage when fail to validate address', async () => {
      isSolanaAddress.mockReturnValue(false)
      const result = await renderCustomHook(useValidate, renderArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeFalsy()
      expect(errorMessage).toBe(INVALID_RECIPIENT)
    })
  })

  /* OTHERS */
  describe('Return correct validation value and error when missing one of the input fields', () => {
    let missingRenderedArgs
    beforeEach(() => {
      missingRenderedArgs = JSON.parse(JSON.stringify(renderArgs))
      renderArgs.selectedAccount.type = TYPE.ETHEREUM
      isEthereumAddress.mockReturnValue(true)
    })

    it('should return false for validated field and default errorMessage when missing selectedToken', async () => {
      delete missingRenderedArgs.selectedToken

      const result = await renderCustomHook(useValidate, missingRenderedArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeFalsy()
      expect(errorMessage).toBe(DEFAULT_ERROR)
    })

    it('should return false for validated field and default errorMessage when missing amount', async () => {
      delete missingRenderedArgs.amount

      const result = await renderCustomHook(useValidate, missingRenderedArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeFalsy()
      expect(errorMessage).toBe(DEFAULT_ERROR)
    })

    it('should return false for validated field and default errorMessage when missing recipient', async () => {
      delete missingRenderedArgs.recipient

      const result = await renderCustomHook(useValidate, missingRenderedArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeFalsy()
      expect(errorMessage).toBe(DEFAULT_ERROR)
    })

    it('should return false for validated field and default errorMessage when missing selectedAccount', async () => {
      delete missingRenderedArgs.selectedAccount
      const result = await renderCustomHook(useValidate, missingRenderedArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeFalsy()
      expect(errorMessage).toBe(DEFAULT_ERROR)
    })

    it('should return true for validated field and null for errorMessage when missing alchemyAddress', async () => {
      delete missingRenderedArgs.alchemyAddress
      const result = await renderCustomHook(useValidate, missingRenderedArgs)

      const { validated, errorMessage } = result.current

      expect(validated).toBeTruthy()
      expect(errorMessage).toBeNull()
    })
  })
})
