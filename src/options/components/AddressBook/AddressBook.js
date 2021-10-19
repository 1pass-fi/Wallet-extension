import React from 'react'
import isEmpty from 'lodash/isEmpty'

import AddIcon from 'img/navbar/create-nft.svg'

import SearchBar from './SearchBar'
import './index.css'

const AddressBook = ({ addresses }) => {
  return (
    <div className="address-book-container">
      <div className="address-book__list__header">
        <SearchBar />
        <div className="address-book-add-icon">
          <AddIcon />
        </div>
      </div>

      <div className="address-book__list__body">
        {isEmpty(addresses) ? (
          <div className="address-book__list__body__name">Empty address book!</div>
        ) : (
          addresses.map((add) => <div className="address-book__list__body__name">{add.name}</div>)
        )}
      </div>
    </div>
  )
}

export default AddressBook
