export const _utf8ArrayToNFTType = (array) => {
  const text = new TextDecoder().decode(array)

  // for the sake of simplicty/readability/understandability, we check the decoded url
  // one by one against metaplex, star atlas, and others
  return (
    this._metaplex(text) || this._starAtlas(text) || this._jsonExtension(text) || this._ipfs(text)
  )
}

export const _metaplex = (text) => {
  const query = 'https://'
  const startIndex = text.indexOf(query)
  if (startIndex === -1) return null

  // metaplex standard nfts live in arweave, see link below
  // https://github.com/metaplex-foundation/metaplex/blob/81023eb3e52c31b605e1dcf2eb1e7425153600cd/js/packages/web/src/contexts/meta/processMetaData.ts#L29
  const isMetaplex = text.includes('arweave')
  const foundNFTUrl = startIndex > -1 && isMetaplex
  if (!foundNFTUrl) return null

  const suffix = '/'
  const suffixIndex = text.indexOf(suffix, startIndex + query.length)
  if (suffixIndex === -1) return null

  const hashLength = 43
  const endIndex = suffixIndex + suffix.length + hashLength
  const url = text.substring(startIndex, endIndex)
  return {
    type: 'METAPLEX',
    url
  }
}

export const  _starAtlas = (text) => {
  const query = 'https://'
  const startIndex = text.indexOf(query)
  if (startIndex === -1) return null

  // star atlas nfts live in https://galaxy.staratlas.com/nfts/...
  const isStarAtlas = text.includes('staratlas')
  const foundNFTUrl = startIndex > -1 && isStarAtlas
  if (!foundNFTUrl) return null

  const suffix = '/nfts/'
  const suffixIndex = text.indexOf(suffix, startIndex + query.length)
  if (suffixIndex === -1) return null

  const hashLength = 44
  const endIndex = suffixIndex + suffix.length + hashLength
  const url = text.substring(startIndex, endIndex)
  return {
    type: 'STAR_ATLAS',
    url
  }
}

export const  _jsonExtension = (text) => {
  // Look for 'https://<...>.json' and that will be the metadata location
  // examples:
  // https://d1b6hed00dtfsr.cloudfront.net/9086.json
  // https://cdn.piggygang.com/meta/3ad355d46a9cb2ee57049db4df57088f.json

  const query = 'https://'
  const startIndex = text.indexOf(query)
  if (startIndex === -1) return null

  const extension = '.json'
  const extensionIndex = text.indexOf(extension)
  const foundNFTUrl = startIndex > -1 && extensionIndex > -1
  if (!foundNFTUrl) return null

  const endIndex = extensionIndex + extension.length
  const url = text.substring(startIndex, endIndex)
  return {
    type: 'METAPLEX',
    url
  }
}

export const  _ipfs = (text) => {
  // Look for 'https://ipfs.io/ipfs/<...alphanumeric...>' and that will be the metadata location
  // e.g. https://ipfs.io/ipfs/QmWJC47JYuvxYw63cRq81bBNGFXPjhQH8nXg71W5JeRMrC

  const query = 'https://'
  const startIndex = text.indexOf(query)
  if (startIndex === -1) return null

  const isIpfs = text.includes('ipfs')
  const foundNFTUrl = startIndex > -1 && isIpfs
  if (!foundNFTUrl) return null

  const suffix = '/ipfs/'
  const suffixIndex = text.indexOf(suffix, startIndex + query.length)
  if (suffixIndex === -1) return null

  let endIndex = suffixIndex + suffix.length
  while (/[a-zA-Z0-9]/.test(text.charAt(endIndex++))) {}

  const url = text.substring(startIndex, endIndex)
  return {
    type: 'METAPLEX',
    url
  }
}
