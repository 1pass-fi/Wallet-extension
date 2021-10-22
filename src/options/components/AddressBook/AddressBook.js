import React, { useEffect, useRef, useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import AddIcon from 'img/navbar/create-nft.svg'

import SearchBar from './SearchBar'
import CreateContactForm from './CreateContactForm'
import ContactDetail from './ContactDetail'
import EditContactForm from './EditContactForm'
import DeleteContactModal from './DeleteContactModal'
import './index.css'

import storage from 'services/storage'
import { v4 as uuid } from 'uuid'

const AddressBook = ({ onClose }) => {
  const [addresses, setAddresses] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedContact, setSelectedContact] = useState({})
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false)

  const ref = useRef(null)
  const modalRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && modalRef.current.contains(event.target)) {
        return
      } else if (ref.current && !ref.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, modalRef])

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

  const removeContact = async (toRemoveId) => {
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

    for (const i in currentAB) {
      if (currentAB[i].id === address.id) {
        currentAB[i] = address
        break
      }
    }

    await storage.generic.set.addressBook(currentAB)
    setAddresses(currentAB)

    setSelectedContact(address)
    setShowEditForm(false)
  }

  return (
    <>
      <div className="address-book-container" ref={ref}>
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
            setShowDeleteContactModal={setShowDeleteContactModal}
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
      {showDeleteContactModal && (
        <DeleteContactModal
          onClose={() => setShowDeleteContactModal(false)}
          contact={selectedContact}
          removeContact={removeContact}
          ref={modalRef}
        />
      )}
    </>
  )
}

export default AddressBook
