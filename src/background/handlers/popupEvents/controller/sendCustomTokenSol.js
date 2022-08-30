// import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
// import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token'

import { createTransferInstruction,getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token'
import { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction,Transaction } from '@solana/web3.js'
import { backgroundAccount } from 'services/account'
import { SolanaTool } from 'services/solana'
import storage from 'services/storage'

const getSigners = (signerOrMultisig, multiSigners) => {
  return signerOrMultisig instanceof PublicKey
    ? [signerOrMultisig, multiSigners]
    : [signerOrMultisig.publicKey, [signerOrMultisig]]
}

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

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    )

    const toWallet = new PublicKey(customTokenRecipient)

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      toWallet
    )

    const multiSigners = []
    const [ownerPublicKey, signers] = getSigners(fromWallet, multiSigners)

    const transaction = new Transaction().add(
      createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        ownerPublicKey,
        rawValue,
        multiSigners,
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      )
    )

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [fromWallet,...signers]
    )

    console.log('signature', signature)

    next({ data: signature })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
