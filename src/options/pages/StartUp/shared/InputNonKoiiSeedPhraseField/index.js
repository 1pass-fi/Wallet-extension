import React, { useState } from 'react'

import EyeIcon from 'img/startup/eye.svg'

import { TYPE } from 'constants/accountConstants'

import './index.css'

export default ({ label = '', value, setValue, placeholder = '', walletType, setIsSeedPhrase }) => {
  const [isShow, setIsShow] = useState(false)
  return (
    <div className='input-seedphrase-field'>
      <EyeIcon className='hide-icon' onClick={() => setIsShow(!isShow)} />
      <label className='label'>{label}</label>
      {!isShow ? (
        <input
          placeholder={placeholder}
          type={isShow ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='input'
        />
      ) : (
        <textarea
          spellCheck='false'
          className='input textarea'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          rows='2'
        ></textarea>
      )}

      {walletType === TYPE.ETHEREUM && (
        <div className='import-private-key'>
          Have a private key?{' '}
          <span
            onClick={() => {
              setIsSeedPhrase(false)
            }}
            className='import-private-key-link'
          >
            Import it instead.
          </span>
        </div>
      )}
    </div>
  )
}
