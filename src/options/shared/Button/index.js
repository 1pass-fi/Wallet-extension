import React from 'react'

import './index.css'

const Button = ({ startIcon: StartIcon, endIcon: EndIcon, text, onClick, variant, disabled=false }) => {
  return (
    <div className={`custom-btn ${variant === 'filled' ? 'filled' : 'outline'} ${disabled === true && 'disabled'}`} onClick={onClick}>
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
