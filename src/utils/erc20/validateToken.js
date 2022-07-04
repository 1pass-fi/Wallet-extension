// import Web3 from 'web3'
const Web3 = () => ({})


const validateToken = async (tokenAddress) => {
  try {
    const provider = await storage.setting.get.ethereumProvider()
    const web3 = new Web3(provider)
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
    await tokenContract.methods.name().call()

    return true
  } catch (err) {
    return false
  }
}

export default validateToken
