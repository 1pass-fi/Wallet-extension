// import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
// import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token'

import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction
} from '@_koi/web3.js'
import {
  createAssociatedTokenAccount,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
  transfer
} from '@solana/spl-token'
import { backgroundAccount } from 'services/account'
import { K2Tool } from 'services/k2'
import storage from 'services/storage'
import clusterApiUrl from 'utils/k2ClusterApiUrl'

const getSigners = (signerOrMultisig, multiSigners) => {
  return signerOrMultisig instanceof PublicKey
    ? [signerOrMultisig, multiSigners]
    : [signerOrMultisig.publicKey, [signerOrMultisig]]
}

export default async (payload, next) => {
  try {
    const { sender, customTokenRecipient, contractAddress, rawValue } = payload.data

    const credentials = await backgroundAccount.getCredentialByAddress(sender)

    const k2Tool = new K2Tool(credentials)
    const fromWallet = k2Tool.keypair

    const provider = await storage.setting.get.k2Provider()
    const connection = new Connection(provider, 'confirmed')

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

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      fromWallet,
      ...signers
    ])

    console.log('signature', signature)

    next({ data: signature })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
