import React from 'react'

import Button from '../Button'
import CloseIcon from 'img/ab-close-icon.svg'
import TickIcon from 'img/ab-circle-tick.svg'

import './index.css'

const ConfirmDeleteContactModal = ({ contact, removeAddress, onClose }) => {
  return (
    <div className="ab-confirm-delete-contact-wrapper">
      <div className="ab-confirm-delete-contact-modal">
        <div className="ab-close-icon" onClick={onClose}>
          <CloseIcon />
        </div>
        <div className="ab-confirm-delete-message">
          Are you sure you want to delete <span>{contact.name}</span> ’s information?
        </div>
        <div className="ab-confirm-delete-buttons">
          <Button
            startIcon={TickIcon}
            onClick={() => removeAddress(contact.id)}
            text="Yes, Delete"
            variant="delete"
          />
          <Button startIcon={CloseIcon} onClick={onClose} text="No, Cancel" variant="cancel" />
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteContactModal
