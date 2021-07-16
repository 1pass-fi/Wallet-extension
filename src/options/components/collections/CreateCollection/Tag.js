import React from 'react'
import './Tag.css'
import { stringTruncate } from '../../../utils'

export default ({tag, tags, setTags}) => {
  const removeTag = (e) => {
    const newTags = tags.filter((aTag) => aTag !== tag)
    setTags(newTags)
  }

  return (
    <div onClick={removeTag} className='tag'>
      {stringTruncate(tag, 10)}
    </div>
  )
}
