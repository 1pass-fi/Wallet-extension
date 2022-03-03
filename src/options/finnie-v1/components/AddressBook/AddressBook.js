import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import { useMachine } from '@xstate/react'
import { createMachine } from 'xstate'

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

const screenMachine = createMachine({
  id: 'screen',
  initial: 'createContact',
  states: {
    createContact: {
      on: {
        CREATE_MANUALLY: 'createManually',
        IMPORT_FROM_DID: 'importFromDID',
        SELECT_CONTACT: 'contactDetail',
        CREATE_CONTACT: 'createContact'
      }
    },
    createManually: {
      on: {
        SAVE: 'contactDetail',
        GO_BACK: 'createContact',
        SELECT_CONTACT: 'contactDetail',
        CREATE_CONTACT: 'createContact'
      }
    },
    importFromDID: {
      on: {
        SAVE: 'contactDetail',
        GO_BACK: 'createContact',
        SELECT_CONTACT: 'contactDetail',
        CREATE_CONTACT: 'createContact'
      }
    },
    contactDetail: {
      on: {
        EDIT: 'editContact',
        GO_BACK: 'createContact',
        SELECT_CONTACT: 'contactDetail',
        CREATE_CONTACT: 'createContact'
      }
    },
    editContact: {
      on: {
        GO_BACK: 'contactDetail',
        SAVE: 'contactDetail',
        CANCEL: 'contactDetail',
        SELECT_CONTACT: 'contactDetail',
        CREATE_CONTACT: 'createContact'
      }
    }
  }
})

const AddressBook = () => {
  const [state, send] = useMachine(screenMachine)

  const showAddressBook = useSelector((state) => state.addressBook.showing)

  const [addresses, setAddresses] = useState([])
  const [filterAddresses, setFilterAddresses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContact, setSelectedContact] = useState({})
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false)

  const dispatch = useDispatch()
  const onClose = useCallback(() => dispatch(hideAddressBook()), [hideAddressBook])

  const addressBookRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && modalRef.current.contains(event.target)) {
        return
      } else if (addressBookRef.current && !addressBookRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [addressBookRef, modalRef])

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
    setSelectedContact(newAddress)
    send('SAVE')
  }

  const removeContact = async (toRemoveId) => {
    // get Address book value from storage instead of the state for data consistency
    let currentAB = (await storage.generic.get.addressBook()) || []
    currentAB = currentAB.filter((add) => add.id != toRemoveId)

    await storage.generic.set.addressBook(currentAB)
    setAddresses(currentAB)
    send('GO_BACK')

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
    send('SAVE')
  }

  return showAddressBook ? (
    <div className="address-book-bg">
      <div className="address-book-container" ref={addressBookRef}>
        <div className="address-book-contacts">
          <div className="address-book__list__header">
            <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
            <div className="address-book-add-icon" onClick={() => send('CREATE_CONTACT')}>
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
                    send('SELECT_CONTACT')
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
        {state.value === 'createContact' && (
          <CreateNewContact goToCreateForm={() => send('CREATE_MANUALLY')} />
        )}
        {state.value === 'createManually' && (
          <CreateContactForm storeNewAddress={storeNewAddress} onClose={() => send('GO_BACK')} />
        )}
        {state.value === 'contactDetail' && (
          <ContactDetail
            onClose={() => send('GO_BACK')}
            contact={selectedContact}
            setShowDeleteContactModal={setShowDeleteContactModal}
            showEditForm={() => send('EDIT')}
          />
        )}
        {state.value === 'editContact' && (
          <EditContactForm
            onClose={() => send('GO_BACK')}
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
