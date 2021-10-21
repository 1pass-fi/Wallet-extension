import React, { useState } from 'react'

import CloseIcon from 'img/ab-close-icon.svg'
import CopyIcon from 'img/copy-icon.svg'
import TrashIcon from 'img/trash-bin.svg'
import AddIcon from 'img/navbar/create-nft.svg'
import TickIcon from 'img/ab-circle-tick.svg'

import Button from '../Button'

import './index.css'

const CreateContactForm = ({ onClose, storeNewAddress }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    notes: '',
    didName: '',
    didValue: '',
  })

  const [userAddresses, setUserAddresses] = useState([{ name: '', value: '' }])

  const handleUserInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
  }

  const handleUserAddressNameChange = (idx, e) => {
    const prevUserAddresses = [...userAddresses]
    prevUserAddresses[idx]['name'] = e.target.value

    setUserAddresses(prevUserAddresses)
  }

  const handleUserAddressValueChange = (idx, e) => {
    const prevUserAddresses = [...userAddresses]
    prevUserAddresses[idx]['value'] = e.target.value

    setUserAddresses(prevUserAddresses)
  }

  return (
    <div className="ab-contact-form">
      <div className="ab-contact-form__body">
        <div className="ab-close-icon" onClick={onClose}>
          <CloseIcon />
        </div>

        <img
          className="ab-contact-form__avatar"
          src="https://i.pravatar.cc/300?img=3"
          alt="avatar"
        />

        <input
          className="ab-contact-form__name"
          placeholder="Name"
          name="name"
          onChange={handleUserInfoChange}
          value={userInfo.name}
        />

        <div className="ab-contact-form__notes-label">Notes</div>
        <input
          className="ab-contact-form__notes"
          placeholder="i.e Larry from the metaverse"
          name="notes"
          onChange={handleUserInfoChange}
          value={userInfo.notes}
        />

        {userAddresses.map((address, idx) => (
          <div className="ab-contact-form__input-group" key={idx}>
            <div className="input-group__first-row">
              <input
                className="input-group__label"
                placeholder={`Address #${idx + 1}`}
                onChange={(e) => handleUserAddressNameChange(idx, e)}
                value={address.name}
              />
            </div>
            <div className="input-group__second-row">
              <div className="second-row__left">
                <input
                  className="input-group__input-value"
                  placeholder="Insert Address"
                  onChange={(e) => handleUserAddressValueChange(idx, e)}
                  value={address.value}
                />
                <div className="ab-copy-icon">
                  <CopyIcon />
                </div>
              </div>
              <div
                className="ab-trash-icon"
                onClick={() => {
                  const newAddresses = [...userAddresses]
                  newAddresses.splice(idx, 1)
                  setUserAddresses(newAddresses)
                }}
              >
                <TrashIcon />
              </div>
            </div>
          </div>
        ))}

        <div
          className="ab-contact-form__add-more"
          onClick={() => setUserAddresses([...userAddresses, { name: '', value: '' }])}
        >
          <div className="ab-form-add-icon">
            <AddIcon />
          </div>
          <span>New Address</span>
        </div>

        <div className="ab-contact-form__input-group ab-contact-form__input-group--did">
          <div className="input-group__first-row">
            <input
              className="input-group__label"
              placeholder="DID link"
              name="didName"
              value={userInfo.didName}
              onChange={handleUserInfoChange}
            />
          </div>
          <div className="input-group__second-row">
            <div className="second-row__left">
              <input
                className="input-group__input-value"
                placeholder="Insert Decentralized ID link"
                name="didValue"
                value={userInfo.didValue}
                onChange={handleUserInfoChange}
              />
              <div className="ab-copy-icon">
                <CopyIcon />
              </div>
            </div>
            <div className="ab-trash-icon">
              <TrashIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="ab-contact-form__footer">
        <Button
          startIcon={TickIcon}
          onClick={() => storeNewAddress({ ...userInfo, addresses: userAddresses })}
          text="Save"
          variant="normal"
        />
      </div>
    </div>
  )
}

export default CreateContactForm
