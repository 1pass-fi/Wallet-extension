import { SignClient } from '@walletconnect/sign-client'
import { getSdkError } from '@walletconnect/utils'
import walletConnectEvents from 'background/handlers/walletConnectEvents'
import get from 'lodash/get'
import walletConnectUtils from 'utils/walletConnect'

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

  async reject(proposal, reason) {
    if (proposal) {
      const { id } = proposal
      await this.signClient.reject({ id, reason })
    }
  }

  async approve(proposal, selectedAccounts) {
    const { id, params } = proposal
    const { proposer, requiredNamespaces, relays } = params

    if (!walletConnectUtils.validateSupportedChain(requiredNamespaces)) {
      await this.reject(proposal, getSdkError('UNSUPPORTED_CHAINS'))
      console.log('Reject proposal with reason: ', getSdkError('UNSUPPORTED_CHAINS'))
      return
    }

    if (proposal) {
      const namespaces = {}
      let accounts = []
      Object.keys(requiredNamespaces).forEach((key) => {
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

      console.log('payload', payload)
    
      const { acknowledged } = await this.signClient.approve(payload)
      await acknowledged()
    }
  }

  async disconnect(topic) {
    await this.signClient.core.pairing.disconnect({ topic })
  }

  async removeAllSession() {
    await this.init()
    const pairings = this.signClient.core.pairing.getPairings()
    await Promise.all(pairings.map(async (pairing) => {
      const topic = get(pairing, 'topic')
      if (topic) {
        await this.signClient.core.pairing.disconnect({ topic })
      }
    }))
  }

  async response({ id, topic, result }) {
    const responsePayload = {
      id: id,
      jsonrpc: '2.0'
    }

    if (get(result, 'error')) responsePayload.error = result.error
    if (get(result, 'data')) responsePayload.result = result.data

    console.log('topic', topic)
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

    setTimeout(async () => {
      await this.init()
      const pairings = walletConnect.signClient.core.pairing.getPairings()
  
      this.signClient.on('session_proposal', sessionProposalCb)
      this.signClient.on('session_request', sessionRequestCb)
    }, 3000)
  }

  async reject(proposal) {
    this.signClient.reject({
      id: proposal?.id,
      reason: {
        code: 1,
        message: 'rejected'
      }
    })
  }
}

const walletConnect = new WalletConnect()

export default walletConnect
