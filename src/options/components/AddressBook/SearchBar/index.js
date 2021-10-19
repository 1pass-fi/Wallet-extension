import React from 'react'

import SearchIcon from 'img/search-icon.svg'

import './index.css'

const SearchBar = () => {
  return (
    <div className="ab-search-bar-wrapper">
      <input className="ab-search-bar" placeholder="Search"></input>
      <div className="ab-search-bar__search-icon">
        <SearchIcon />
      </div>
    </div>
  )
}

export default SearchBar
