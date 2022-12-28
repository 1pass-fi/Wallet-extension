const { TYPE } = require('constants/accountConstants')

const mockPopupBackgroundRequest = jest.fn().mockImplementation(() => {
  wallet
})
const mockGenerateWallet = jest.fn().mockImplementation(async ({ walletType }) => {
  let seedphrase
  switch (walletType) {
    case TYPE.ARWEAVE:
      seedphrase =
        'credit erosion kidney deposit buddy pioneer window material embark assist quit still'
      break
    case TYPE.ETHEREUM:
      seedphrase = 'cluster cram fish penalty twelve evoke because wheel close income bag pupil'
      break
    case TYPE.SOLANA:
      seedphrase =
        'rent involve devote swap uniform zero improve firm domain ketchup giggle universe'
      break
    case TYPE.K2:
      seedphrase =
        'neglect trigger better derive lawsuit erosion cry online private rib vehicle drop '
      break
  }
  return seedphrase.split(' ')
})

const mockVerifyPassword = jest.fn().mockImplementation(async ({ password }) => {
  return true
})

const mockSaveWallet = jest.fn().mockImplementation(async () => {
  return '0xabcde'
})

const mockImportWallet = jest.fn().mockImplementation(async () => {
  return '0xabcde'
})
mockPopupBackgroundRequest.wallet = {
  generateWallet: mockGenerateWallet,
  verifyPassword: mockVerifyPassword,
  saveWallet: mockSaveWallet,
  importWallet: mockImportWallet
}

module.exports = { popupBackgroundRequest: mockPopupBackgroundRequest }
