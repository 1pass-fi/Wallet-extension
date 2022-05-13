import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token'

import { backgroundAccount } from 'services/account'
import { SolanaTool } from 'services/solana'
import storage from 'services/storage'

export default async (payload, next) => {
  try {
    const { sender, customTokenRecipient, contractAddress, rawValue } = payload.data

    const credentials = await backgroundAccount.getCredentialByAddress(sender)
    const solanaTool = new SolanaTool(credentials)
    const fromWallet = solanaTool.keypair

    const provider = await storage.setting.get.solanaProvider()
    const connection = new Connection(clusterApiUrl(provider))

    const mint = new PublicKey(contractAddress)

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    )

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      customTokenRecipient
    )

    const signature = await transfer(
      connection,
      fromWallet,
      mint,
      fromTokenAccount.address,
      toTokenAccount.address,
      rawValue
    )

    next({ data: signature })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
