import React from 'react'

import CloseIcon from 'img/ab-close-icon.svg'
import CopyIcon from 'img/copy-icon.svg'
import TrashIcon from 'img/trash-bin.svg'
import AddIcon from 'img/navbar/create-nft.svg'
import TickIcon from 'img/ab-circle-tick.svg'

import Button from '../Button'

import './index.css'

const CreateContactForm = () => {
  return (
    <div className="ab-contact-form">
      <div className="ab-contact-form__body">
        <div className="ab-close-icon">
          <CloseIcon />
        </div>

        <img
          className="ab-contact-form__avatar"
          src="https://i.pravatar.cc/300?img=3"
          alt="avatar"
        />

        <input className="ab-contact-form__name" placeholder="Name" />

        <div className="ab-contact-form__notes-label">Notes</div>
        <input className="ab-contact-form__notes" placeholder="i.e Larry from the metaverse" />

        <div className="ab-contact-form__input-group">
          <div className="input-group__first-row">
            <input className="input-group__label" placeholder="Address #1" />
          </div>
          <div className="input-group__second-row">
            <div className="second-row__left">
              <input className="input-group__input-value" placeholder="Insert Address" />
              <div className="ab-copy-icon">
                <CopyIcon />
              </div>
            </div>
            <div className="ab-trash-icon">
              <TrashIcon />
            </div>
          </div>
        </div>
        <div className="ab-contact-form__input-group">
          <div className="input-group__first-row">
            <input className="input-group__label" placeholder="Address #1" />
          </div>
          <div className="input-group__second-row">
            <div className="second-row__left">
              <input className="input-group__input-value" placeholder="Insert Address" />
              <div className="ab-copy-icon">
                <CopyIcon />
              </div>
            </div>
            <div className="ab-trash-icon">
              <TrashIcon />
            </div>
          </div>
        </div>

        <div className="ab-contact-form__add-more">
          <div className="ab-form-add-icon">
            <AddIcon />
          </div>
          <span>New Address</span>
        </div>

        <div className="ab-contact-form__input-group ab-contact-form__input-group--did">
          <div className="input-group__first-row">
            <input className="input-group__label" placeholder="DID link" />
          </div>
          <div className="input-group__second-row">
            <div className="second-row__left">
              <input
                className="input-group__input-value"
                placeholder="Insert Decentralized ID link"
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
        <Button startIcon={TickIcon} text="Save" variant="normal" />
      </div>
    </div>
  )
}

export default CreateContactForm
