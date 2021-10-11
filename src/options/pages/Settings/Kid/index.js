import React, { useState } from 'react'
import map from 'lodash/map'
import upperFirst from 'lodash/upperFirst'
import { Link } from 'react-router-dom'

import IDCardIcon from 'img/id-card-icon.svg'
import AddIcon from 'img/navbar/create-nft.svg'
import EditIcon from 'img/edit-icon-collection.svg'
import DefaultAvt from 'img/default-avt-green.svg'
import KidInputField from './kidInputField'
import ProfileCover from 'img/profile-cover-placeholder.png'
import Button from '../../../shared/Button'

import './index.css'

const KidPage = () => {
  const [userKID, setuserKID] = useState({
    name: '',
    country: '',
    pronouns: '',
    description: '',
  })

  const [socialNetworks, setSocialNetworks] = useState({
    twitter: '',
    instagram: '',
    facebook: '',
    website: '',
    tiktok: '',
  })

  const onChangeUserInfo = (e) => {
    setuserKID({ ...userKID, [e.target.name]: e.target.value })
  }

  const onChangeSocialNetwork = (e) => {
    setSocialNetworks({ ...socialNetworks, [e.target.name]: e.target.value })
  }

  const addSocialNetworks = () => {
    console.log('clickedddd', socialNetworks)
    setSocialNetworks({
      ...socialNetworks,
      [`Network${Object.keys(socialNetworks).length - 4}`]: '',
    })
  }

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
        <div className="form-img">
          <div className="img">
            <DefaultAvt />
          </div>
          <Button startIcon={EditIcon} text="Change Avatar" />
          <div className="avt-desc">
            Or <Link to="/create">create an NFT</Link> to add a new image to your gallery
          </div>
          <img className="profile-cover" src={ProfileCover} alt="profile-cover"></img>
          <Button startIcon={EditIcon} text="Change Background" />
          <div className="avt-desc">This is yout cover image</div>
        </div>

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

          <div className="section-name">Social Networks</div>
          {map(socialNetworks, (val, key) => (
            <KidInputField
              key={key}
              label={upperFirst(key)}
              isRequired={false}
              value={val}
              setValue={onChangeSocialNetwork}
            />
          ))}

          <div className="add-more" onClick={addSocialNetworks}>
            <AddIcon className="add-more-icon" />
            Add more
          </div>
          <div className="save-kid-btn">
            <Button variant="filled" text="Save & Update" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default KidPage
