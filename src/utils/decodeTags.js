const decodeTags = (tags) => {
  if (!tags) return null
  const result = {}
  tags.forEach(tag => {
    const tagKey = Buffer.from(tag.name, 'base64').toString()
    const tagValue = Buffer.from(tag.value, 'base64').toString()
    result[tagKey] = tagValue
  })

  return result
}

export default decodeTags
