import { SignClient } from '@walletconnect/sign-client'
import get from 'lodash/get'

const PROJECT_ID = '0eb91b1c1b2541776c8a29ee31f992c8'
const PROJECT_METADATA = {
  name: 'Finnie',
  description: 'Finnie wallet from Koii Network',
  url: 'https://www.koii.network/',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

class WalletConnect {
  constructor() {
    this.signClient = null
  }

  async init() {
    this.signClient = await SignClient.init({
      projectId: PROJECT_ID,
      metadata: PROJECT_METADATA
    })
  }

  async pair(uri) {
    await this.signClient.core.pairing.pair({ uri })
  }

  async activate(topic) {
    await this.signClient.core.pairing.activate({ topic })
  }

  async approve(proposal) {
    const { id, params } = proposal
    const { proposer, requiredNamespaces, relays } = params
  
    if (proposal) {
      const namespaces = {}
      Object.keys(requiredNamespaces).forEach(key => {
        requiredNamespaces[key].chains.map(chain => {
          selectedAccounts[key].map(acc => accounts.push(`${chain}:${acc}`))
        })
        namespaces[key] = {
          accounts,
          methods: requiredNamespaces[key].methods,
          events: requiredNamespaces[key].events
        }
      })
  
      const payload = {
        id,
        relayProtocol: relays[0].protocol,
        namespaces
      }
    
      const { acknowledged } = await this.signClient.approve(payload)
      await acknowledged()
    }
  }

  async disconnect(topic) {
    await this.signClient.core.pairing.disconnect({ topic })
  }

  async removeAllSession() {
    await this.init()
    const pairings = await this.signClient.core.pairing.getPairings()
    await Promise.all(pairings.map(async (pairing) => {
      const topic = get(pairing, 'topic')
      if (topic) {
        await this.signClient.core.pairing.disconnect({ topic })
      }
    }))
  }

  async response({ id, topic, data }) {
    const responsePayload = {
      'id': id,
      'jsonrpc': '2.0',
      'result': data,
    }
    console.log('response', id, topic, data)

    await this.signClient.respond({ topic, response: responsePayload })
  }
}

const walletConnect = new WalletConnect()

export default walletConnect
