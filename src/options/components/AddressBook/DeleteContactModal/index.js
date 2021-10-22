import React, { useEffect, useRef } from 'react'
import ReactTooltip from 'react-tooltip'

import Button from '../Button'
import CloseIcon from 'img/ab-close-icon.svg'
import TickIcon from 'img/ab-circle-tick.svg'

import './index.css'

const DeleteContactModal = ({ contact, onClose, removeAddress }) => {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

  return (
    <div className="address-book-modal-wrapper">
      <div className="ab-confirm-delete-contact-modal" ref={ref}>
        <div data-tip="Close" data-for="close" className="ab-close-icon" onClick={onClose}>
          <CloseIcon />
        </div>
        <div className="ab-confirm-delete-message">
          Are you sure you want to delete <span>{contact.name}</span> ’s information?
        </div>
        <div className="ab-confirm-delete-buttons">
          <Button
            startIcon={TickIcon}
            onClick={() => {
              removeAddress(contact.id)
              onClose()
            }}
            text="Yes, Delete"
            variant="delete"
          />
          <Button startIcon={CloseIcon} onClick={onClose} text="No, Cancel" variant="cancel" />
        </div>
      </div>
      <ReactTooltip id="close" />
    </div>
  )
}

export default DeleteContactModal
