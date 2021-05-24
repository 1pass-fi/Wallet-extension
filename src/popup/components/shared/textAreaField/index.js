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
    <div className={`text-area-field ${className}`}>
      <div className='label'>{label}</div>
      <div className='input-wrapper'>
        <textarea
          spellCheck='false'
          name={name}
          className={`input ${isDisplay || 'protect'}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        ></textarea>
        <ToggleDisplayIcon className='toggle-display' onClick={toggleDisplay} />
      </div>
    </div>
  )
}
