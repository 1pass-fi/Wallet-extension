import React, { useState } from 'react'

import './index.css'

const InputPrivateKeyField = ({
  label = '',
  value,
  setValue,
  placeholder = '',
  setIsSeedPhrase,
}) => {
  return (
    <div className='input-private-key-field'>
      <label className='label'>{label}</label>
      <textarea
        spellCheck='false'
        className='input'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows='2'
      ></textarea>

      <div className='import-private-key'>
        Have a recovery phrase?{' '}
        <span
          onClick={() => {
            setIsSeedPhrase(true)
          }}
          className='import-private-key-link'
        >
          Enter your 12-word phrase instead.
        </span>
      </div>
    </div>
  )
}

export default InputPrivateKeyField
