import React from 'react'

import './index.css'

const Button = ({ startIcon: StartIcon, endIcon: EndIcon, text, onClick, variant }) => {
  return (
    <div className={`custom-btn ${variant === 'filled' ? 'filled' : 'outline'}`} onClick={onClick}>
      {StartIcon && (
        <div className="btn-icon">
          <StartIcon />
        </div>
      )}
      <span>{text}</span>
      {EndIcon && <EndIcon />}
    </div>
  )
}

export default Button
