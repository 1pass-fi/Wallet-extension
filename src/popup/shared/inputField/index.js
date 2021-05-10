import React, { useState } from 'react'

import ToggleDisplayIcon from 'img/toggle-display.svg'
import './index.css'

export default ({ label, value, onChange, placeholder = '' }) => {
  const [isDisplay, setDisplay] = useState(false)
  const toggleDisplay = () => {
    setDisplay(!isDisplay)
  }

  return (
    <div className="input-field">
      <div className="label">{label}</div>
      <div className="input-wrapper">
        <input
          className="input"
          type={isDisplay ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}>
        </input>
        <ToggleDisplayIcon className="toggle-display" onClick={toggleDisplay} />
      </div>
    </div>
  )
}
