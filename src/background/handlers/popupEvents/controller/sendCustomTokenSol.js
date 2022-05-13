import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token'

import { backgroundAccount } from 'services/account'
import { SolanaTool } from 'services/solana'
import storage from 'services/storage'

export default async (payload, next) => {
  try {
    const { sender, customTokenRecipient, contractAddress, rawValue } = payload.data

    console.log({ sender, customTokenRecipient, contractAddress, rawValue })

    const credentials = await backgroundAccount.getCredentialByAddress(sender)
    const solanaTool = new SolanaTool(credentials)
    const fromWallet = solanaTool.keypair

    const provider = await storage.setting.get.solanaProvider()
    const connection = new Connection(clusterApiUrl(provider))

    const mint = new PublicKey(contractAddress)

    console.log('mint', mint)

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    )

    console.log('fromTokenAccount', fromTokenAccount)
    const toWallet = new PublicKey(customTokenRecipient)

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      toWallet
    )

    console.log('toTokenAccount', toTokenAccount)

    console.log({
      connection,
      fromWallet,
      _: fromTokenAccount.address,
      __: toTokenAccount.address,
      ___: fromWallet.publicKey,
      rawValue
    })

    const signature = await transfer(
      connection,
      fromWallet,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      parseInt(rawValue)
    )

    console.log('signature', signature)

    next({ data: signature })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
