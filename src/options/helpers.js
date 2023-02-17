import { PATH } from 'constants/koiConstants'

export const getShareUrl = (network, txid) => {
  switch (network) {
    case 'twitter':
      return `${PATH.SHARE_TWITTER}?url=https%3A%2F%2Fkoii.live%2F${txid}%2Ehtml&text=Check%20out%20my%20NFT%2C%20now%20stored%20on%20Koii%E2%80%94%20forever!`
    case 'facebook':
      return `${PATH.SHARE_FACEBOOK}?u=https%3A%2F%2Fkoii.live%2F${txid}%2Ehtml&quote=Check%20out%20my%20NFT%2C%20now%20stored%20on%20Koii%E2%80%94%20forever!`
    case 'linkedin':
      return `${PATH.SHARE_LINKEDIN}?url=https%3A%2F%2Fkoii.live%2F${txid}%2Ehtml`
  }
}

// Will refactor this code
export const shareFriendCode = (code, network) => {
  const text = `${chrome.i18n.getMessage('ShareFriendCodeMsg')}${code}`
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
