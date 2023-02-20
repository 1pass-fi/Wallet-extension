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
      {value ? (
        <span className="on">{chrome.i18n.getMessage('ON')}</span>
      ) : (
        <span className="off">{chrome.i18n.getMessage('OFF')}</span>
      )}
      <div className={`slider round ${value ? 'checked' : ''}`}></div>
    </label>
  )
}
