import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import debounce from 'lodash/debounce'

import { GalleryContext } from 'options/galleryContext'
import SearchIcon from 'img/search-icon.svg'

import './index.css'

export default () => {
  const { setSearchTerm } = useContext(GalleryContext)
  const [inputValue, setInputValue] = useState('')
  const search = useRef(debounce(setSearchTerm, 1000))

  useEffect(() => {
    search.current(inputValue)
  }, [inputValue])

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
      <button className='search-button'>
        <SearchIcon className='search-icon' />
      </button>
    </div>
  )
}
