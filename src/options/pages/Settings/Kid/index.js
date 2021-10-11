import React, { useState } from 'react'

import IDCardIcon from 'img/id-card-icon.svg'
import KidInputField from './kidInputField'

import './index.css'

const KidPage = () => {
  const [userKID, setuserKID] = useState({
    name: '',
    country: '',
    pronouns: '',
    description: '',
  })

  const onChangeUserInfo = (e) => {
    setuserKID({ ...userKID, [e.target.name]: e.target.value })
  }

            <div className='field'>
              <label className='label'>Description</label>
  return (
    <div className="kid-page-wrapper">
      <div className="title-section">
        <IDCardIcon />
        <h2>Decentralized Identity</h2>
        <p className="leading">
          Connect to the decentralized internet with just your wallet. No more email log-ins or
          giving your personal data straight to Big Tech. This information will be public.
        </p>
        <div className="wallet-address">KOII Wallet: 12345...12345 (Account 1)</div>
      </div>
      <div className="form-section">
        <div className="form-img">Place holder</div>
        <div className="form-text">
          <KidInputField
            label="Name"
            isRequired={true}
            description="or pseudonym"
            value={userKID.name}
            setValue={onChangeUserInfo}
          />
          <KidInputField
            label="Country"
            isRequired={true}
            value={userKID.country}
            setValue={onChangeUserInfo}
          />
          <KidInputField
            label="Pronouns"
            isRequired={false}
            example="For example: 'she/her' or 'they/them'"
            value={userKID.pronouns}
            setValue={onChangeUserInfo}
          />
          <div className="kid-input">
            <div className="kid-input-label-section">
              <label className="kid-input-label">Description*</label>
            </div>
            <div className="kid-input-input-section">
              <textarea
                value={userKID.description}
                onChange={(e) => onChangeUserInfo(e)}
                name="description"
                className="kid-input-area-field"
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KidPage
