const mockedAccounts = require('../__fixtures__/allAccountMetadata.json')

const mockPopupAccount = jest.fn().mockImplementation(() => {})
const mockGetAllMetadata = jest.fn().mockImplementation(async () => mockedAccounts)
mockPopupAccount.getAllMetadata = mockGetAllMetadata

module.exports = { popupAccount: mockPopupAccount }
