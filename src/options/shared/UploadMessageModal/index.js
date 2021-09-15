import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import CloseIcon from 'img/close-x-icon-gallery.svg'

import './index.css'

const propTypes = {
  onClose: PropTypes.func,
}

const Modal = ({ onClose, children, className = '' }) => {
  const ref = useRef()

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
    <div className='modal-upload-container'>
      <div className={`modall ${className}`} ref={ref}>
        <div className='modal-close-icon'>
          <CloseIcon onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  )
}

Modal.propTypes = propTypes

export default Modal