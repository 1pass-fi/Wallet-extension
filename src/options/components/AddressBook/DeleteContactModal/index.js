import React, { useEffect, useRef } from 'react'
import ReactTooltip from 'react-tooltip'

import Button from '../Button'
import CloseIcon from 'img/ab-close-icon.svg'
import TickIcon from 'img/ab-circle-tick.svg'

import './index.css'

const DeleteContactModal = React.forwardRef(({ contact, onClose, removeContact }, ref) => {
  const innerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (innerRef.current && !innerRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [innerRef])

  return (
    <div className="address-book-modal-wrapper" ref={ref}>
      <div className="ab-confirm-delete-contact-modal" ref={innerRef}>
        <div data-tip="Close" data-for="close" className="ab-close-icon" onClick={onClose}>
          <CloseIcon />
        </div>
        <div className="ab-confirm-delete-message">
          Are you sure you want to delete <span>{contact.name.length < 13 ? contact.name : contact.name.slice(0,13) + '...'}</span> ’s information?
        </div>
        <div className="ab-confirm-delete-buttons">
          <Button
            startIcon={TickIcon}
            onClick={() => {
              removeContact(contact.id)
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
})

export default DeleteContactModal
