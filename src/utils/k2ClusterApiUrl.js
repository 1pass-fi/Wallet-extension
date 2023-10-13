import { clusterApiUrl } from '@_koi/web3.js'
import { K2_NETWORK_PROVIDER } from 'constants/koiConstants'

export default function k2ClusterApiUrl(cluster, tls) {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i

  if (urlRegex.test(cluster)) {
    return cluster
  }

  if (cluster === 'testnet') {
    return K2_NETWORK_PROVIDER.TESTNET
  }

  return clusterApiUrl(cluster, tls)
}
