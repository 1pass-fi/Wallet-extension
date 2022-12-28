const mockedAccounts = require('../__fixtures__/allAccountMetadata.json')

const mockPopupAccount = jest.fn().mockImplementation(() => {})
const mockGetAllMetadata = jest.fn().mockImplementation(async () => mockedAccounts)
const mockAccountGetMetadata = jest.fn().mockImplementation(async () => mockedAccounts[0])
const mockGetAccount = jest.fn().mockImplementation(async () => ({
  get: {
    metadata: mockAccountGetMetadata
  }
}))
mockPopupAccount.getAllMetadata = mockGetAllMetadata
mockPopupAccount.getAccount = mockGetAccount
module.exports = { popupAccount: mockPopupAccount }
