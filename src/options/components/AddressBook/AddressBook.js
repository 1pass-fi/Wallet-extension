import React, { useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import AddIcon from 'img/navbar/create-nft.svg'

import SearchBar from './SearchBar'
import CreateContactForm from './CreateContactForm'
import './index.css'

const AddressBook = ({ addresses }) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  return (
    <div className="address-book-container">
      <div className="address-book-contacts">
        <div className="address-book__list__header">
          <SearchBar />
          <div className="address-book-add-icon" onClick={() => setShowCreateForm(true)}>
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
      {showCreateForm && <CreateContactForm onClose={() => setShowCreateForm(false)} />}
    </div>
  )
}

export default AddressBook
