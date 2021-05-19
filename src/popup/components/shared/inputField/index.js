import React, { useState } from 'react'

import ToggleDisplayIcon from 'img/toggle-display.svg'
import './index.css'

export default ({
  label,
  value,
  onChange,
  name = '',
  placeholder = '',
  className = '',
  type = 'password',
}) => {
  const [isDisplay, setDisplay] = useState(type !== 'password')
  const toggleDisplay = () => {
    console.log('on click')
    setDisplay(!isDisplay)
  }

  return (
    <div className={`input-field ${className}`}>
      <div className='label'>{label}</div>
      <div className='input-wrapper'>
        <input
          name={name}
          className='input'
          type={isDisplay ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        ></input>
        < ToggleDisplayIcon className='toggle-display' onClick={toggleDisplay} />
      </div>
    </div>
  )
}
