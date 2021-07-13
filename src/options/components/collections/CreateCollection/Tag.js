import React from 'react'
import './Tag.css'

export default ({tag, tags, setTags}) => {
  const removeTag = (e) => {
    const newTags = tags.filter((tag) => tag !== e.target.textContent)
    setTags(newTags)
  }

  return (
    <div onClick={removeTag} className='tag'>
      {tag}
    </div>
  )
}
