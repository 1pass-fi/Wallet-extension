const { default: verifyPassword } = require('background/handlers/popupEvents/controller/verifyPassword')
const { TYPE } = require('constants/accountConstants')

const mockPopupBackgroundRequest = jest.fn().mockImplementation(() => {
  wallet
})
const mockGenerateWallet = jest.fn().mockImplementation(async ({ walletType }) => {
  let seedphrase
  switch (walletType) {
    case TYPE.ARWEAVE:
      seedphrase = 'slam during purse symbol genius edge mistake stamp raven connect host fatigue'
      break
    case TYPE.ETHEREUM:
      seedphrase = 'gorilla label maple solve thought avoid song pill margin harsh still broom'
      break
    case TYPE.SOLANA:
      seedphrase = 'color tired merge rural token pole capable people metal student catch uphold'
      break
    case TYPE.K2:
      seedphrase = 'color tired merge rural token pole capable people metal student catch uphold'
      break
  }
  return seedphrase.split(' ')
})

const mockVerifyPassword = jest.fn().mockImplementation(async ({ password }) => {
  return true
})

mockPopupBackgroundRequest.wallet = {
  generateWallet: mockGenerateWallet,
  verifyPassword: mockVerifyPassword
}

module.exports = { popupBackgroundRequest: mockPopupBackgroundRequest }
