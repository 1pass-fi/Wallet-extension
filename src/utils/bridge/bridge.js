const Web3 = require('web3')
const { ABI2, ABI } = require('./ABI')
const HDWalletProvider = require('@truffle/hdwallet-provider')

// import Web3 from 'web3'

const fromEthToArweave = async () => {
  try {
    const provider = new HDWalletProvider('939eeb8b935762306c76ce02ce7947b18ff4dcdac2aba553c2660b0cd673ff6f',
      'https://rinkeby.infura.io/v3/70c4cf77c9054fd3a3196659f7dfe4f7'
    )

    const web3 = new Web3(provider)

    const addresses = await web3.eth.getAccounts()
    console.log('addresses: ', addresses)
    /* 
      create contract from koiToken contract address
    */
    const koiTokenContract = new web3.eth.Contract(ABI,'0xD1183ad3B7934466aCB98D17B85Ced15999EA3AC')
    
    /* 
      create contract from koiRouter contract address
    */
    const koiRouterContract = new web3.eth.Contract(ABI2, '0xff3096ED566445c9F24F615b3afD6677AD4Dcba4')

    const isApprove = await koiRouterContract.methods.isApprovedForAll(addresses[0], '0xD1183ad3B7934466aCB98D17B85Ced15999EA3AC').call()
    console.log('isApprove', isApprove)

    if (isApprove === false) {
      const result = await koiRouterContract.methods.setApprovalForAll('0xD1183ad3B7934466aCB98D17B85Ced15999EA3AC', true).send({from: addresses[0]})
      console.log('*****RECEIPT1: ', result)
    }

    const depositResult = await koiTokenContract.methods.deposit('0xff3096ED566445c9F24F615b3afD6677AD4Dcba4', '79815999319843347607878690319208729376727520789855333437166829176352736804865', 1, 'ou-OUmrWuT0hnSiUMoyhGEbd3s5b_ce8QK0vhNwmno4').send({from: addresses[0]})
    console.log('*****RECEIPT2: ', depositResult)
  } catch (err) {
    console.log(err.message)
  }
}

fromEthToArweave()
