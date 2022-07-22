import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

import CloseIcon from 'img/circle-close-icon.svg'

import './index.css'

const propTypes = {
  onClose: PropTypes.func,
}

const Modal = ({ onClose, children, className = '', isWelcomeScreen = false }) => {
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
    <div className='modal-container'>
      <div className={`${isWelcomeScreen ? 'welcome-screen-modal' : 'modal'} ${className}`} ref={ref}>
        <div data-tip='Close' data-for='close-btn' className='modal-close-icon'>
          <CloseIcon onClick={onClose} />
        </div>
        {children}
      </div>
      <ReactTooltip place='top' id='close-btn' type="dark" effect="float"/>
    </div>
  )
}

Modal.propTypes = propTypes

export default Modal
