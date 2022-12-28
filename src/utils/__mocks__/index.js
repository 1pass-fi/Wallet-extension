const fromArToWinston = jest.fn().mockImplementation((value) => value * 1000000000000)
const fromEthToWei = jest.fn().mockImplementation((value) => value * 1000000000000000000)
const fromSolToLamp = jest.fn().mockImplementation((value) => value * 1000000000)
const isEthereumAddress = jest.fn().mockReturnValue(true)
const isArweaveAddress = jest.fn().mockReturnValue(true)
const isSolanaAddress = jest.fn().mockReturnValue(true)
module.exports = {
  fromArToWinston,
  fromEthToWei,
  fromSolToLamp,
  isEthereumAddress,
  isArweaveAddress,
  isSolanaAddress
}
