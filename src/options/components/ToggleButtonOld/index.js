import React, { useState } from 'react'

import './index.css'

export default ({ value, setValue }) => {
  const onToggle = (e) => {
    setValue(e.target.checked)
  }
  return (
    <label className="switch">
      <input
        className="switch-checkbox"
        type="checkbox"
        id="togBtn"
        defaultChecked={value}
        onChange={onToggle}
      />
      {value ? <span className="on">ON</span> : <span className="off">OFF</span>}
      <div className={`slider round ${value ? 'checked' : ''}`}></div>
    </label>
  )
}
