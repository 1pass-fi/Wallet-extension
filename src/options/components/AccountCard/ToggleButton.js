import React, { useState } from 'react'

import './index.css'

export default ({ value, setValue }) => {
  const onToggle = (e) => {
    setValue(!value)
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
      {value ? <span className="st-on">ON</span> : <span className="st-off">OFF</span>}
      <div className={`st-slider st-round ${value ? 'st-checked' : ''}`}></div>
    </label>
  )
}
