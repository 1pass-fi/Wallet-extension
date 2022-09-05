import base58 from 'bs58'
import { get } from 'lodash'
import { backgroundAccount } from 'services/account'
import { SolanaTool } from 'services/solana'
import nacl from 'tweetnacl'

export default async (payload, tab, next) => {
  try {
    const {
      origin,
      favicon,
      url,
      hadPermission,
      hasPendingRequest,
      siteAddressDictionary,
      activatedAddress,
      connectedAddresses
    } = tab

    // TODO Thuan Ngo: implement signMessage functions
    // Let's implement this endpoint in the next integration
    console.log('SOLANA SIGN MESSAGE...')

    const params = get(payload, 'data.params')
    const message = get(params, 'message')

    const credentials = await backgroundAccount.getCredentialByAddress(connectedAddresses)
    const solTool = new SolanaTool(credentials)
    const keypair = solTool.keypair

    const signature = nacl.sign.detached(message, keypair.secretKey)

    if (nacl.sign.detached.verify(message, signature, keypair.publicKey.toBytes()))
      next({
        data: {
          publicKey: base58.encode(keypair.publicKey),
          signature: base58.encode(signature)
        }
      })
    else next({ data: { status: 500, data: 'Invalid signature' } })
  } catch (err) {
    console.error(err.mesage)
    next({ data: { status: 500, data: 'Solana signMessage error' } })
  }
}
