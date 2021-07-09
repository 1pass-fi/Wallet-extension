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

// Will refactor this code
export const shareFriendCode = (code, network) => {
  const text = `Use my code to get 1 free NFT upload on https://koi.rocks/ \n${code}`
  let url
  switch(network) {
    case 'twitter':
      url = encodeURI(`${PATH.SHARE_TWITTER}?text=${text}`)
      chrome.windows.create({
        url,
        focused: true,
        type: 'popup',
        height: 400,
        width: 600
      })
      break
    case 'facebook':
      url = encodeURI(`${PATH.SHARE_FACEBOOK}?u=https://koi.rocks&quote=${text}`)
      chrome.windows.create({
        url,
        focused: true,
        type: 'popup',
        height: 400,
        width: 600
      })
      break
    case 'linkedin':
      url = encodeURI(`${PATH.SHARE_LINKEDIN}?title=${text}`)
      chrome.windows.create({
        url,
        focused: true,
        type: 'popup',
        height: 400,
        width: 600
      })
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

export const sendReferralCode = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200 })
    }, 2000)
  })
}
