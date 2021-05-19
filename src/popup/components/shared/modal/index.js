import React, { useState } from 'react'
import PropTypes from 'prop-types'
import CloseIcon from 'img/close-icon.svg'

import './index.css'

const propTypes = {
  onClose: PropTypes.func,
}

const Modal = ({ onClose, children }) => {
  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-close-icon">
          <CloseIcon onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  )
}

Modal.propTypes = propTypes

export default Modal
