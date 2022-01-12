import React from 'react'

import toLower from 'lodash/toLower'

import './index.css'

const KidInputField = ({ 
  label, 
  isRequired, 
  description = '', 
  example = '', 
  value, 
  setValue, 
  disabled,
  error
}) => {
  return (
    <div className="kid-input">
      <div className="kid-input-label-section">
        <label className="kid-input-label">{`${label}${isRequired ? '*' : ''}`}</label>
        <span className="description">{description}</span>
      </div>
      <div className="kid-input-input-section">
        <div className='field'>
          {label === 'kID' && <div className='prefix-link'>https://koii.id/</div>}
          <input
            className={`kid-input-field ${label === 'kID' && 'kid'}`}
            name={toLower(label)}
            type="text"
            value={value}
            onChange={(e) => setValue(e)}
            disabled={disabled}
          />
        </div>
        <div className="description">{example}</div>
        <span className="error">{error}</span>
      </div>
    </div>
  )
}

export default KidInputField
