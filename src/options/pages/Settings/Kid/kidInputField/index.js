import React from 'react'

import lowercase from 'lodash/lowercase'

import './index.css'

const KidInputField = ({ label, isRequired, description = '', example = '', value, setValue }) => {
  return (
    <div className="kid-input">
      <div className="kid-input-label-section">
        <label className="kid-input-label">{`${label}${isRequired ? '*' : ''}`}</label>
        <span className="description">{description}</span>
      </div>
      <div className="kid-input-input-section">
        <input
          className="kid-input-field"
          name={lowercase(label)}
          type="text"
          value={value}
          onChange={(e) => setValue(e)}
        />
        <div className="description">{example}</div>
      </div>
    </div>
  )
}

export default KidInputField
