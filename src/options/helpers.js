import { PATH } from 'koiConstants'

export const getShareUrl = (network, txid) => {
  switch (network) {
    case 'twitter':
      return `${PATH.SHARE_TWITTER}?url=https%3A%2F%2Fkoi.rocks%2Fcontent-detail%2F${txid}&text=Check%20out%20my%20NFT%2C%20now%20stored%20on%20Koi%E2%80%94%20forever!`
    case 'facebook':
      return `${PATH.SHARE_FACEBOOK}?u=https%3A%2F%2Fkoi.rocks%2Fcontent-detail%2F${txid}&quote=Check%20out%20my%20NFT%2C%20now%20stored%20on%20Koi%E2%80%94%20forever!`
    case 'linkedin':
      return `${PATH.SHARE_LINKEDIN}?url=https%3A%2F%2Fkoi.rocks%2Fcontent-detail%2F${txid}`
  }
}

export const createShareWindow = (network, txid) => {
  const url = getShareUrl(network, txid)
  chrome.windows.create({
    url,
    focused: true,
    type: 'popup',
    height: 400,
    width: 600
  })
}
