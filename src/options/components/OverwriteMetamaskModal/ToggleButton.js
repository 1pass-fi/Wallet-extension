import React, { useState } from 'react'

import './ToggleButton.css'

export default ({ value, setValue }) => {
  const onToggle = (e) => {
    setValue(e.target.checked)    
  }

  return (
    <label className="st-switch">
      <input
        className="st-switch-checkbox"
        type="checkbox"
        id="togBtn"
        defaultChecked={value}
        checked={value}
        onChange={onToggle}
      />
      <div className={`st-slider st-round ${!value ? 'st-checked' : ''}`}></div>
    </label>
  )
}
