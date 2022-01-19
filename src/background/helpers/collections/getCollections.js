import axios from 'axios'
import { smartweave } from 'smartweave'
import { get } from 'lodash'

import { ArweaveAccount } from 'services/account/Account'
import arweave from 'services/arweave'

const bundlerUrl = 'https://mainnet.koii.live'

export default async (account) => {
  try {
    if (!(account instanceof ArweaveAccount)) throw new Error('Invalid account input')
    const address = await account.get.address()

    const savedCollections = await account.get.collections()
    console.log(`Saved collections of ${address}: ${savedCollections.length}`)
    let fetchedCollections = await getCollectionsByWalletAddress(address, 50)
    fetchedCollections = fetchedCollections.map(collection => get(collection, 'node.id'))

    console.log(`Fetched collections of ${address}: ${fetchedCollections.length}`)

    if (savedCollections.length === fetchedCollections.length) return savedCollections

    fetchedCollections = await readState(fetchedCollections)

    const collectionNfts = await resolveNfts(fetchedCollections, account)

    return { fetchedCollections, collectionNfts }
  } catch (err) {
    console.error(err.message)
    return { fetchedCollections: [], collectionNfts: []}
  }
}

const getCollectionsByWalletAddress = async (walletAddress, count, cursorId) => {
  const BLOCK_TEMPLATE = `
  pageInfo {
    hasNextPage
  }
  edges {
    cursor
    node {
      id anchor signature recipient
      owner { address key }
      fee { winston ar }
      quantity { winston ar }
      data { size type }
      tags { name value }
      block { id timestamp height previous }
      parent { id }
    }
  }`
  const countStr = count !== undefined ? `, first: ${count}` : ''
  const afterStr = cursorId !== undefined ? `, after: "${cursorId}"` : ''
  const query = `
    query {
      transactions(tags: [{
        name: "Action",
        values: ["Collection/Create"]
    },
      {
        name: "Wallet-Address",
        values: ["${walletAddress}"]
    }
    ]${countStr}${afterStr}) {
        ${BLOCK_TEMPLATE}
      }
    }`
  const request = JSON.stringify({ query })
  const gqlResp = await gql(request)
  if (gqlResp && gqlResp.data.transactions.edges) {
    return gqlResp.data.transactions.edges
  }
  return false
}

const readState = async (txIds) => {
  const result = await Promise.all(txIds.map(async id => {
    try {
      let state = await smartweave.readContract(arweave, id)
      state = { ...state, id }
      return state
    } catch (err) {
      console.error(err.message)
      return null
    }
  }))
  return result.filter(collection => collection)
}

const gql = async (request) => {
  const { data } = await axios.post('https://arweave.net/graphql', request, {
    headers: { 'content-type': 'application/json' }
  })
  return data
}

const resolveNfts = async (collections, account) => {
  let collectionNftIds = collections.map((collection) => collection.collection)
  collectionNftIds = [].concat.apply([], collectionNftIds)

  const allAssets = await account.get.assets()
  const nftIds = allAssets.map((asset) => asset.txId)

  const missingNftIds = collectionNftIds.filter((collectionNftId) => {
    return nftIds.indexOf(collectionNftId) === -1
  })

  let collectionNfts = await account.method.getNfts(missingNftIds)
  collectionNfts = collectionNfts.filter((collection) => collection)
  return collectionNfts
}
