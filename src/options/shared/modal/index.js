import React, { useEffect,useRef } from 'react'
import ReactTooltip from 'react-tooltip'
import CloseIcon from 'img/circle-close-icon.svg'
import PropTypes from 'prop-types'

import './index.css'

const propTypes = {
  onClose: PropTypes.func
}

const Modal = ({ onClose, children, className = '', isWelcomeScreen = false }) => {
  const ref = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
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
  }, [ref])

  return (
    <div className="modal-container">
      <div
        className={`${isWelcomeScreen ? 'welcome-screen-modal' : 'modal'} ${className}`}
        ref={ref}
      >
        <div data-tip="Close" data-for="close-btn" className="modal-close-icon">
          <CloseIcon onClick={onClose} />
        </div>
        {children}
      </div>
      <ReactTooltip place="top" id="close-btn" type="dark" effect="float" />
    </div>
  )
}

Modal.propTypes = propTypes

export default Modal
