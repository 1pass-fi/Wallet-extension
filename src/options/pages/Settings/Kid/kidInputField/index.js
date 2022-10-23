import React from 'react'
import ShareIcon from 'img/share-icon-3.svg'
import toLower from 'lodash/toLower'
import Hint from 'options/components/Hint/Hint'

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
        {label === 'DID Link' && (
          <Hint
            className="inline ml-1.5 relative -top-4"
            text="You can share your DID profile<br>with anyone using this URL."
            variant="white"
          />
        )}
      </div>
      <div className="kid-input-input-section">
        <div className="field">
          {label === 'DID Link' && <div className="prefix-link">https://koii.id/</div>}
          <input
            className={`kid-input-field ${label === 'DID Link' && 'kid'}`}
            name={toLower(label)}
            type="text"
            value={value}
            onChange={(e) => setValue(e)}
            disabled={disabled}
          />
          {label === 'DID Link' && (
            <a href={`https://koii.id/${value}`} target="_blank">
              <ShareIcon id="kid-share-icon" />
            </a>
          )}
        </div>
        <span className="description">{description}</span>
        <div className="description">{example}</div>
        <span className="error">{error}</span>
      </div>
    </div>
  )
}

export default KidInputField
