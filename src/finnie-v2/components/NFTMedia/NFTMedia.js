import React from 'react'

import { includes } from 'lodash'

const NFTMedia = ({ contentType, source }) => {
  if (includes(contentType, 'image')) {
    return <img src={source} className="w-full h-full object-cover rounded" />
  }
  if (includes(contentType, 'video')) {
    return <video src={source} className="w-full h-full object-cover rounded" muted controls />
  }
  if (includes(contentType, 'html')) {
    return <iframe className="w-full h-full rounded" frameBorder="0" src={source} />
  }

  return null
}

export default NFTMedia
