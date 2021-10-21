import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import AddIcon from 'img/navbar/create-nft.svg'

import SearchBar from './SearchBar'
import CreateContactForm from './CreateContactForm'
import ContactDetail from './ContactDetail'
import EditContactForm from './EditContactForm'
import './index.css'

import storage from 'services/storage'
import { v4 as uuid } from 'uuid'

const AddressBook = () => {
  const [addresses, setAddresses] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedContact, setSelectedContact] = useState({})

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
    currentAB.push({ id: uuid(), ...newAddress })

    await storage.generic.set.addressBook(currentAB)

    setAddresses(currentAB)
  }

  const removeAddress = async (toRemoveId) => {
    // get Address book value from storage instead of the state for data consistency
    let currentAB = (await storage.generic.get.addressBook()) || []
    currentAB = currentAB.filter((add) => add.id != toRemoveId)

    await storage.generic.set.addressBook(currentAB)
    setAddresses(currentAB)
    setSelectedContact({})
  }

  const updateAddress = async (address) => {
    // get Address book value from storage instead of the state for data consistency
    const currentAB = (await storage.generic.get.addressBook()) || []

    for (let contact of currentAB) {
      if (contact.id === address.id) {
        contact = address
        break
      }
    }

    await storage.generic.set.addressBook(currentAB)
    setAddresses(currentAB)

    setSelectedContact(address)
    setShowEditForm(false)
  }

  return (
    <div className="address-book-container">
      <div className="address-book-contacts">
        <div className="address-book__list__header">
          <SearchBar />
          <div
            className="address-book-add-icon"
            onClick={() => {
              setShowCreateForm(true)
              setShowEditForm(false)
              setSelectedContact({})
            }}
          >
            <AddIcon />
          </div>
        </div>

        <div className="address-book__list__body">
          {isEmpty(addresses) ? (
            <div className="address-book__list__body__name">Empty address book!</div>
          ) : (
            addresses.map((add) => (
              <div
                onClick={() => {
                  setSelectedContact(add)
                  setShowCreateForm(false)
                }}
                className="address-book__list__body__name"
                key={add.id}
              >
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
      {!isEmpty(selectedContact) && !showEditForm && (
        <ContactDetail
          onClose={() => setSelectedContact({})}
          contact={selectedContact}
          removeAddress={removeAddress}
          showEditForm={() => {
            setShowEditForm(true)
          }}
        />
      )}
      {showEditForm && (
        <EditContactForm
          onClose={() => setShowEditForm(false)}
          contact={selectedContact}
          updateAddress={updateAddress}
        />
      )}
    </div>
  )
}

export default AddressBook
