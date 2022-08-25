import React, { useEffect, useRef } from 'react'

import Button from '../Button'
import CloseIcon from 'img/v2/close-icon-blue.svg'
import BackIcon from 'img/v2/back-icon-blue.svg'

import './index.css'

const DeleteContactModal = React.forwardRef(({ contact, onClose, removeContact }, ref) => {
  const innerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (innerRef.current && !innerRef.current.contains(event.target)) {
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

    document.addEventListener('keydown', handlePressingEsc)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handlePressingEsc)
    }
  }, [innerRef])

  return (
    <div className="address-book-modal-wrapper" ref={ref}>
      <div className="ab-confirm-delete-contact-modal" ref={innerRef}>
        <div className="ab-confirm-delete-contact-modal__header">
          <div className="ab-close-icon" onClick={onClose}>
            <BackIcon />
          </div>
          <div>Delete Contact</div>
          <div className="ab-close-icon" onClick={onClose}>
            <CloseIcon />
          </div>
        </div>
        <div className="ab-confirm-delete-message">
          Are you sure you want to delete{' '}
          {contact.name.length < 13 ? contact.name : contact.name.slice(0, 13) + '...'} from your
          address book? You cannot undo this action.
        </div>
        <div className="ab-confirm-delete-buttons">
          <Button
            onClick={() => {
              removeContact(contact.id)
              onClose()
            }}
            text="Delete Contact"
            variant="delete"
          />
          <Button onClick={onClose} text="Go Back" variant="cancel" />
        </div>
      </div>
    </div>
  )
})

export default DeleteContactModal
