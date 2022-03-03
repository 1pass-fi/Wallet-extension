import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import { hideAddressBook } from 'options/actions/addressBook'

import AddIcon from 'img/navbar/create-nft.svg'

import SearchBar from './SearchBar'
import CreateContactForm from './CreateContactForm'
import ContactDetail from './ContactDetail'
import EditContactForm from './EditContactForm'
import DeleteContactModal from './DeleteContactModal'
import CreateNewContact from './CreateNewContact'
import './index.css'

import storage from 'services/storage'
import { v4 as uuid } from 'uuid'

const AddressBook = () => {
  const showAddressBook = useSelector((state) => state.addressBook.showing)

  const [addresses, setAddresses] = useState([])
  const [filterAddresses, setFilterAddresses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showCreateNewContact, setShowCreateNewContact] = useState(true)
  const [selectedContact, setSelectedContact] = useState({})
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false)

  const ref = useRef(null)
  const modalRef = useRef(null)

  const dispatch = useDispatch()

  const onClose = useCallback(() => dispatch(hideAddressBook()), [hideAddressBook])

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

  useEffect(() => {
    const filterAddresses = addresses.filter((add) => {
      return add.name?.toLowerCase().includes(searchTerm.toLowerCase())
    })
    setFilterAddresses(filterAddresses)
  }, [searchTerm, addresses])

  const storeNewAddress = async (newAddress) => {
    // get Address book value from storage instead of the state for data consistency
    const currentAB = (await storage.generic.get.addressBook()) || []
    currentAB.push({ id: uuid(), ...newAddress })

    await storage.generic.set.addressBook(currentAB)

    setAddresses(currentAB)

    // after save contact successful, show the contact detail view
    setShowCreateForm(false)
    setSelectedContact(newAddress)
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

  return showAddressBook ? (
    <div className="address-book-bg">
      <div className="address-book-container" ref={ref}>
        <div className="address-book-contacts">
          <div className="address-book__list__header">
            <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
            <div
              className="address-book-add-icon"
              onClick={() => {
                setShowCreateNewContact(true)
                setShowCreateForm(false)
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
              filterAddresses.map((add) => (
                <div
                  onClick={() => {
                    setSelectedContact(add)
                    setShowCreateForm(false)
                    setShowCreateNewContact(false)
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
        {showCreateNewContact && (
          <CreateNewContact
            goToCreateForm={() => {
              setShowCreateNewContact(false)
              setShowCreateForm(true)
            }}
          />
        )}
        {showCreateForm && (
          <CreateContactForm
            storeNewAddress={storeNewAddress}
            onClose={() => {
              setShowCreateForm(false)
              setShowCreateNewContact(true)
            }}
          />
        )}
        {!isEmpty(selectedContact) && !showEditForm && (
          <ContactDetail
            onClose={() => {
              setSelectedContact({})
              setShowCreateNewContact(true)
            }}
            contact={selectedContact}
            setShowDeleteContactModal={setShowDeleteContactModal}
            showEditForm={() => {
              setShowEditForm(true)
            }}
          />
        )}
        {showEditForm && (
          <EditContactForm
            onClose={() => {
              setShowEditForm(false)
              setShowCreateNewContact(false)
            }}
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
    </div>
  ) : null
}

export default AddressBook
