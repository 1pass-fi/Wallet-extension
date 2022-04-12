import { backgroundAccount } from 'services/account'

export default async (payload, next) => {
  try {
    const { sender, customTokenRecipient, contractAddress, value } = payload.data
    console.log('payload', { sender, customTokenRecipient, contractAddress, value })

    const credential = await backgroundAccount.getCredentialByAddress(sender)
    const account = await backgroundAccount.getAccount(credential)

    const receipt = await account.method.transferToken({ 
      tokenContractAddress: contractAddress,
      to: customTokenRecipient,
      value
    })

    next({ data: receipt })

  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
