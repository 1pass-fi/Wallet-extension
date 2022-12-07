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
    try {
      if (!this.signClient) {
        this.signClient = await SignClient.init({
          projectId: PROJECT_ID,
          metadata: PROJECT_METADATA
        })
      }
    } catch (err) {
      console.error('walletconnect-init', err)
    }
  }

  async pair(uri) {
    try {
      await this.signClient.core.pairing.pair({ uri })
    } catch (err) {
      console.error('walletconnect-pair', err)
    }
  }

  async activate(topic) {
    try {
      await this.signClient.core.pairing.activate({ topic })
    } catch (err) {
      console.error('walletconnect-activate', err)
    }
  }

  async reject(proposal, reason = {
    code: 1,
    message: 'rejected'
  }) {
    try {
      if (proposal) {
        const { id } = proposal
        await this.signClient.reject({ id, reason })
      }
    } catch (err) {
      console.error('walletconnect-reject', err)
    }
  }

  async approve(proposal, selectedAccounts) {
    try {
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
    } catch (err) {
      console.error('walletconnect-approve', err)
      return err
    }
  }

  async disconnect(topic) {
    try {
      await this.signClient.core.pairing.disconnect({ topic })
    } catch (err) {
      console.error('walletconnect-disconnect', err)
    }
  }

  async removeAllSession() {
    try {
      await this.init()
      const pairings = this.signClient.core.pairing.getPairings()
      await Promise.all(pairings.map(async (pairing) => {
        const topic = get(pairing, 'topic')
        if (topic) {
          await this.signClient.core.pairing.disconnect({ topic })
        }
      }))
    } catch (err) {
      console.error('removeAllSession', err)
    }
  }

  async response({ id, topic, result }) {
    try {
      const responsePayload = {
        id: id,
        jsonrpc: '2.0'
      }
  
      if (get(result, 'error')) responsePayload.error = result.error
      if (get(result, 'data')) responsePayload.result = result.data
  
      await this.signClient.respond({ topic, response: responsePayload })
    } catch (err) {
      console.error('walletconnect-response', err)
    }
  }
}

const walletConnect = new WalletConnect()

export default walletConnect
