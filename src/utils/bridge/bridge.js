const Web3 = require('web3')
const { ABI2, ABI } = require('./ABI')
const HDWalletProvider = require('@truffle/hdwallet-provider')

// import Web3 from 'web3'

const fromEthToArweave = async () => {
  try {
    const provider = new HDWalletProvider('939eeb8b935762306c76ce02ce7947b18ff4dcdac2aba553c2660b0cd673ff6f',
      'https://goerli.infura.io/v3/70c4cf77c9054fd3a3196659f7dfe4f7'
    )

    const web3 = new Web3(provider)

    const addresses = await web3.eth.getAccounts()
    console.log('addresses: ', addresses)
    /* 
      create contract from koiToken/user nft contract address, it can be koiNFt contract or any other nfts contract
    */
    const nftContract = new web3.eth.Contract(ABI2,'0xff3096ED566445c9F24F615b3afD6677AD4Dcba4')
    
    /* 
      create contract from koiRouter contract address 0xD1183ad3B7934466aCB98D17B85Ced15999EA3AC
    */
    const koiRouterContract = new web3.eth.Contract(ABI, '0xD1183ad3B7934466aCB98D17B85Ced15999EA3AC')

    const isApprove = await nftContract.methods.isApprovedForAll(addresses[0], '0xD1183ad3B7934466aCB98D17B85Ced15999EA3AC').call()
    console.log('isApprove', isApprove)

    if (isApprove === false) {
      // give router contract access to make transaction on behalf of the user
      const result = await nftContract.methods.setApprovalForAll('0xD1183ad3B7934466aCB98D17B85Ced15999EA3AC', true).send({from: addresses[0]})
      console.log('*****RECEIPT1: ', result)
    }

    const depositResult = await koiRouterContract.methods.deposit('0xff3096ed566445c9f24f615b3afd6677ad4dcba4', '42', 1, 'ou-OUmrWuT0hnSiUMoyhGEbd3s5b_ce8QK0vhNwmno4').send({from: addresses[0]})
    console.log('*****RECEIPT2: ', depositResult)
  } catch (err) {
    console.log(err.message)
  }
}

fromEthToArweave()
