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
      {value ? (
        <span className="st-on">{chrome.i18n.getMessage('ON')}</span>
      ) : (
        <span className="st-off">{chrome.i18n.getMessage('OFF')}</span>
      )}
      <div className={`st-slider st-round ${value ? 'st-checked' : ''}`}></div>
    </label>
  )
}
