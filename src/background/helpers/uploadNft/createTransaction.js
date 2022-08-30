import { NFT_CONTRACT_SRC } from 'constants/koiConstants'
import arweave from 'services/arweave'

export default async ({ u8, nftContent, nftTags, fileType, ownerAddress, createdAt }) => {
  try {
    const balances = { [ownerAddress]: 1 }
    const ticker = 'KOINFT'
    const isNSFW = nftContent.isNSFW || false

    const initialState = {
      'owner': ownerAddress,
      'title': nftContent.title,
      'name': nftContent.owner, // inputted username
      'description': nftContent.description,
      'ticker': ticker,
      'balances': balances,
      'contentType': fileType,
      'createdAt': createdAt,
      'tags': nftTags,
      'locked': [],
      'isPrivate': false
    }

    const transaction = await arweave.createTransaction({ data: u8 })
    addTag({ transaction, fileType, initialState, isNSFW })

    return transaction
  } catch (err) {
    throw new Error(err.message)
  }
}

const addTag = ({ transaction, fileType, initialState, isNSFW }) => {
  transaction.addTag('Content-Type', fileType)
  transaction.addTag('Network', 'Koii')
  transaction.addTag('Action', 'marketplace/Create')
  transaction.addTag('App-Name', 'SmartWeaveContract')
  transaction.addTag('App-Version', '0.3.1')
  transaction.addTag('Contract-Src', NFT_CONTRACT_SRC)
  transaction.addTag('Init-State', JSON.stringify(initialState))
  transaction.addTag('NSFW', isNSFW)
}
