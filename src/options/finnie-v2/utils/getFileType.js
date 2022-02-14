import get from 'lodash/get'

export const NFT_TYPES = { IMAGE: 'image', VIDEO: 'video', AUDIO: 'audio', HTML: 'html' }

export const getFileType = (file) => {
  const fileType = get(file, 'type', '')
  for (let i in NFT_TYPES) {
    if (fileType.includes(NFT_TYPES[i])) {
      return NFT_TYPES[i]
    }
  }
  return ''
}
