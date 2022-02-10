import React, { useState } from 'react'

import './ToogleButton.css'

export default ({ value, setValue, disabled }) => {
  const onToggle = (e) => {
    if (!disabled) {
      setValue(e.target.checked)
    }
  }
  return (
    <label className="is-private-switch">
      <input
        className="is-private-switch-checkbox"
        type="checkbox"
        id="togBtn"
        defaultChecked={value}
        onChange={onToggle}
      />
      {value ? <span className="on">PUBLIC</span> : <span className="off">PRIVATE</span>}
      <div className={`slider round ${value ? 'checked' : ''}`}></div>
    </label>
  )
}
