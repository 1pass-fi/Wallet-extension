import errorHandler from '../../errorHandler'

const resendNft = async (account, transaction) => {
  const targetAddress = transaction?.source
  const contractAddress = transaction?.contract
  if (!targetAddress || !contractAddress) throw new Error('Invalid transaction input')
  return await account.method.transferNFT(contractAddress, targetAddress)
}

export default errorHandler(resendNft)
