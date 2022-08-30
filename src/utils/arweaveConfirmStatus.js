import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https',
  port: 443,
})

export default async (txId) => {
  const response = await arweave.transactions.getStatus(txId)
  console.log(response)
  return !isEmpty(get(response, 'confirmed'))
}
 