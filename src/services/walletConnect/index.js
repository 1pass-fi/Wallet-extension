import { SignClient } from '@walletconnect/sign-client'
import walletConnectEvents from 'background/handlers/walletConnectEvents'
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
        // requiredNamespaces[key].chains.map(chain => {
        //   selectedAccounts[key].map(acc => accounts.push(`${chain}:${acc}`))
        // })
        const accounts = ['eip155:5:0xb076413401172CBB73C082107514De3376E4FF6c']
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

  async response({ id, topic, data }, isError = false) {
    const responsePayload = {
      id: id,
      jsonrpc: '2.0'
    }

    if (!isError) responsePayload.result = data
    else responsePayload.error = data

    console.log('response', id, topic, data)
    console.log('responsePayload', responsePayload)

    await this.signClient.respond({ topic, response: responsePayload })
  }

  async reload() {
    const sessionProposalCb = (event) => {
      this.approve(event)
    }

    const sessionRequestCb = (event) => {
      console.log('session_request event', event)

      const endpoint = event.params.request.method
      const payload = { id: event.id, topic: event.topic, params: event.params.request.params }
      walletConnectEvents.sendMessage(endpoint, payload)
    }

    await this.init()
    const pairings = await walletConnect.signClient.core.pairing.getPairings()
    console.log('parings', pairings)

    this.signClient.on('session_proposal', sessionProposalCb)
    this.signClient.on('session_request', sessionRequestCb)
  }
}

const walletConnect = new WalletConnect()

export default walletConnect
