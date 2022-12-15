const mockedAccounts = require('../__fixtures__/accounts.json')

module.exports = {
  popupAccount: {
    getAllMetadata: async () => mockedAccounts
  }
}
