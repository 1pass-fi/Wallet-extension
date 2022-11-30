import { ethers } from 'ethers'
import { backgroundAccount } from 'services/account'

export default async (payload, next) => {
  try {
    const { sender, customTokenRecipient, contractAddress, rawValue } = payload.data

    const credential = await backgroundAccount.getCredentialByAddress(ethers.utils.getAddress(sender))
    const account = await backgroundAccount.getAccount(credential)

    const receipt = await account.method.transferToken({ 
      tokenContractAddress: contractAddress,
      to: customTokenRecipient,
      value: rawValue
    })

    next({ data: receipt.transactionHash })

  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
