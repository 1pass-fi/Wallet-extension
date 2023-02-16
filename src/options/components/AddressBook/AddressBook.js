import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useMachine } from '@xstate/react'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
import AddIcon from 'img/navbar/create-nft.svg'
import isEmpty from 'lodash/isEmpty'
import { hideAddressBook } from 'options/actions/addressBook'
import storage from 'services/storage'
import { v4 as uuid } from 'uuid'
import { createMachine } from 'xstate'

import ContactDetail from './ContactDetail'
import CreateContactForm from './CreateContactForm'
import CreateNewContact from './CreateNewContact'
import DeleteContactModal from './DeleteContactModal'
import EditContactForm from './EditContactForm'
import ImportFromDID from './ImportFromDID'
import SearchBar from './SearchBar'

import './index.css'

const screenMachine = createMachine({
  id: 'screen',
  initial: 'createContact',
  states: {
    createContact: {
      entry: ['clearSelectedContact'],
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
  const kidLinkPrefix = 'https://koii.id/'
  const showAddressBook = useSelector((state) => state.addressBook.showing)

  const [addresses, setAddresses] = useState([])
  const [filterAddresses, setFilterAddresses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContact, setSelectedContact] = useState({})
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false)

  const [state, send] = useMachine(screenMachine, {
    actions: {
      clearSelectedContact: () => setSelectedContact({})
    }
  })

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

    const handlePressingEsc = (event) => {
      if (event.defaultPrevented) {
        return // Should do nothing if the default action has been cancelled
      }

      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handlePressingEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handlePressingEsc)
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

    const toSaveAddress = { id: uuid(), ...newAddress }
    currentAB.push(toSaveAddress)

    await storage.generic.set.addressBook(currentAB)

    setAddresses(currentAB)

    setSelectedContact(toSaveAddress)
    send('SAVE')
  }

  const validateDIDNotExist = async (did) => {
    const didLink = kidLinkPrefix + did
    // get Address book value from storage instead of the state for data consistency
    const currentAB = (await storage.generic.get.addressBook()) || []

    return currentAB.every((address) => {
      return address.didValue !== didLink
    })
  }

  const storeDIDAddress = async (didContact) => {
    // get Address book value from storage instead of the state for data consistency
    const currentAB = (await storage.generic.get.addressBook()) || []

    const newAddress = {
      name: didContact.state.name,
      notes: didContact.state.description,
      didName: 'DID link',
      didValue: didContact.didValue,
      avatarUrl: `https://arweave.net/${didContact.state.picture}`,
      addresses: [
        { name: 'Address #1', type: TYPE.ARWEAVE, value: didContact.state.addresses.arweave }
      ]
    }

    const toSaveAddress = { id: uuid(), ...newAddress }
    currentAB.push(toSaveAddress)

    await storage.generic.set.addressBook(currentAB)
    setAddresses(currentAB)
    setSelectedContact(toSaveAddress)
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
              <div className="address-book__list__body__name">{chrome.i18n.getMessage('AddressBookEmpty')}</div>
            ) : (
              filterAddresses.map((add) => (
                <div
                  onClick={() => {
                    setSelectedContact(add)
                    send('SELECT_CONTACT')
                  }}
                  className={clsx(
                    'address-book__list__body__name',
                    selectedContact.id === add.id && 'selected'
                  )}
                  key={add.id}
                >
                  {add.name}
                </div>
              ))
            )}
          </div>
        </div>
        {state.value === 'createContact' && (
          <CreateNewContact
            goToCreateForm={() => send('CREATE_MANUALLY')}
            goToImportFromDID={() => send('IMPORT_FROM_DID')}
          />
        )}
        {state.value === 'importFromDID' && (
          <ImportFromDID
            onClose={() => send('GO_BACK')}
            validateDIDNotExist={validateDIDNotExist}
            storeDIDAddress={storeDIDAddress}
          />
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
