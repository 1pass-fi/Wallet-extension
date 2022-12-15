const getTokenData = jest.fn().mockImplementation(async () => ({
  logo: 'logo',
  balance: 'balance',
  price: 'price',
  name: 'name',
  symbol: 'symbol',
  decimal: 'decimal',
  contractAddress: 'contractAddress'
}))

export const getK2CustomTokensData = jest.fn().mockImplementation(async () => ({
  logo: 'logo',
  balance: 'balance',
  price: 'price',
  name: 'name',
  symbol: 'symbol',
  decimal: 'decimal',
  contractAddress: 'contractAddress'
}))

export const getSolanaCustomTokensData = jest.fn().mockImplementation(async () => ({
  logo: 'logo',
  balance: 'balance',
  price: 'price',
  name: 'name',
  symbol: 'symbol',
  decimal: 'decimal',
  contractAddress: 'contractAddress'
}))

export default getTokenData
