import React from 'react'
import './index.css'

export default ({
  label,
  onClick = () => {},
  isEnable = true,
  className = '',
  type = '',
}) => {
  return (
    <button
      disabled={!isEnable}
      onClick={onClick}
      className={`button-shared ${
        type === 'outline' ? 'button-outline' : 'button-filled'
      } ${className}`}
    >
      {label}
    </button>
  )
}
