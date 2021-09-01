// modules
import React from 'react'

// styles
import './index.css'


export default ({
  label,
  onClick = () => { },
  isEnable = true,
  className = '',
  type = '',
}) => {
  const buttonType = type === '' ? 'button-filled' : `button-${type}`

  return (
    <button
      disabled={!isEnable}
      onClick={onClick}
      className={`button-shared ${buttonType} ${className}`}
    >
      {label}
    </button>
  )
}
