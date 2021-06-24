import React, { useContext, useEffect, useState } from 'react'

import { GalleryContext } from 'options/galleryContext'
import SearchIcon from 'img/search-icon.svg'

import './index.css'

export default () => {
  const { setSearchTerm } = useContext(GalleryContext)

  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    return () => setSearchTerm('')
  }, [])

  return (
    <div className='search-bar'>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className='search-input'
        placeholder='search my gallery'
      />
      <button
        className='search-button'
        onClick={() => setSearchTerm(inputValue)}
      >
        <SearchIcon className='search-icon' />
      </button>
    </div>
  )
}
