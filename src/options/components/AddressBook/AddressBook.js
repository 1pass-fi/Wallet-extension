import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import AddIcon from 'img/navbar/create-nft.svg'

import SearchBar from './SearchBar'
import CreateContactForm from './CreateContactForm'
import './index.css'

import storage from 'services/storage'

const AddressBook = () => {
  const [addresses, setAddresses] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    const getStorageAddresses = async () => {
      const storageAddresses = await storage.generic.get.addressBook()
      setAddresses(storageAddresses)
    }

    getStorageAddresses()
  }, [])

  const storeNewAddress = async (newAddress) => {
    // get Address book value from storage instead of the state for data consistency
    const currentAB = (await storage.generic.get.addressBook()) || []
    currentAB.push(newAddress)

    await storage.generic.set.addressBook(currentAB)

    setAddresses(currentAB)
  }

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
            addresses.map((add, idx) => (
              <div className="address-book__list__body__name" key={`${add.name}-${idx}`}>
                {add.name}
              </div>
            ))
          )}
        </div>
      </div>
      {showCreateForm && (
        <CreateContactForm
          storeNewAddress={storeNewAddress}
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </div>
  )
}

export default AddressBook
