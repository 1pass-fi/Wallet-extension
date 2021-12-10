import React from 'react'

import './index.css'

const Button = ({ startIcon: StartIcon, endIcon: EndIcon, text, onClick, variant, disabled=false }) => {
  return (
    <button disabled={disabled} className={`custom-btn ${variant === 'filled' ? 'filled' : 'outline'}`} onClick={onClick}>
      {StartIcon && (
        <div className="btn-icon">
          <StartIcon />
        </div>
      )}
      <span>{text}</span>
      {EndIcon && <EndIcon />}
    </button>
  )
}

export default Button
