import axios from 'axios'
import { smartweave } from 'smartweave'
import { get } from 'lodash'

import { ArweaveAccount } from 'services/account/Account'
import arweave from 'services/arweave'


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

    return fetchedCollections
  } catch (err) {
    console.error(err.message)
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

