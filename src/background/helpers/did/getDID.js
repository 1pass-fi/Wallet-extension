import axiosAdapter from '@vespaiach/axios-fetch-adapter'
import axios from 'axios'
import { get } from 'lodash'

export default async (address, contractId) => {
  try {
    const BLOCk_TEMPLATE = `
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

    let query
    /* 
      if contractId -> get CreateReactApp transaction
    */
    if (!contractId) {
      query = `
      query {
        transactions(tags: [{
          name: "Koii-Did",
          values: ["CreateContract"]
        }, {
          name: "Owner",
          values: ["${address}"]
        }
      ]) {
        ${BLOCk_TEMPLATE}
      }
      }
      `
    } else {
      query = `
      query {
        transactions(tags: [{
          name: "Koii-Did",
          values: ["CreateReactApp"]
        }, {
          name: "Contract-Id",
          values: ["${contractId}"]
        }
      ]) {
        ${BLOCk_TEMPLATE}
      }
      }
      `
    }

    const URL_ARWEAVE_GQL = 'https://arweave.net/graphql'

    const request = JSON.stringify({ query })
    const { data } = await axios.post(URL_ARWEAVE_GQL, request, {
      headers: { 'content-type': 'application/json' },
      adapter: axiosAdapter
    })

    return get(data, 'data.transactions.edges[0].node.id') || null
  } catch (err) {
    console.error(err.message)
    return null
  }
}
