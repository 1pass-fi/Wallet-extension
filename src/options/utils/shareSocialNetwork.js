import { PATH,SOCIAL_NETWORKS } from 'constants/koiConstants'

export default (network, txid) => {
  const url = getShareUrl(network, txid)
  chrome.windows.create({
    url,
    focused: true,
    type: 'popup',
    height: 400,
    width: 600
  })
}

export const getShareUrl = (network, txid) => {
  switch (network) {
    case SOCIAL_NETWORKS.TWITTER:
      return `${PATH.SHARE_TWITTER}?url=https%3A%2F%2Fkoii.live%2F${txid}%2Ehtml&text=Check%20out%20my%20NFT%2C%20now%20stored%20on%20Koii%E2%80%94%20forever!`
    case SOCIAL_NETWORKS.FACEBOOK:
      return `${PATH.SHARE_FACEBOOK}?u=https%3A%2F%2Fkoii.live%2F${txid}%2Ehtml&quote=Check%20out%20my%20NFT%2C%20now%20stored%20on%20Koii%E2%80%94%20forever!`
    case SOCIAL_NETWORKS.LINKEDIN:
      return `${PATH.SHARE_LINKEDIN}?url=https%3A%2F%2Fkoii.live%2F${txid}%2Ehtml`
  }
}
