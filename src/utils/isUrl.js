const isUrl = (url) => {
  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i

  return urlRegex.test(url)
}

export default isUrl
