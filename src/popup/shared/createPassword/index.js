import React from 'react'

import InputField from '../inputField/index'
import ButtonShared from '../button/index'
import './index.css'

export default ({ onClick }) => {
  return (
    <div className="create-password">
      <div className="fields">
        <InputField label="New password" onChange={() => { }} placeholder="Make it unique (min. 8 characters)" />
        <InputField label="Confirm password" onChange={() => { }} placeholder="" />
      </div>
      <div className="term-service">
        <div className="checkbox">
          <input type="checkbox" />
        </div>
        <label>I agree with the <a href="#">Terms of Service</a></label>
      </div>
      <div className="button">
        <ButtonShared label="Import Wallet" />
      </div>
    </div>
  )
}
