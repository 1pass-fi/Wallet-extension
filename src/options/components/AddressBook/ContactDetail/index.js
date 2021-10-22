import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactTooltip from 'react-tooltip'

import EditIcon from 'img/edit-icon-collection.svg'
import CloseIcon from 'img/ab-close-icon.svg'
import FinnieKoiiIcon from 'img/finnie-koi-white-icon.svg'
import Button from '../Button'
import Avatar from 'img/ab-avatar.png'
import CopyIcon from 'img/copy-icon.svg'
import TrashIcon from 'img/trash-bin.svg'
import ConfirmDeleteContactModal from '../ConfirmDeleteContactModal'

import './index.css'

const ContactDetail = ({ contact, onClose, showEditForm, setShowDeleteContactModal }) => {
  return (
    <div className="ab-contact-detail">
      <div className="ab-contact-detail__header">
        <Button startIcon={EditIcon} onClick={showEditForm} text="Edit" variant="normal" />
        <div className="ab-close-icon" onClick={onClose}>
          <CloseIcon />
        </div>
      </div>

      <img className="ab-contact-detail__avatar" src={Avatar} alt="avatar" />

      <div className="ab-contact-detail__name">{contact.name}</div>

      <div className="ab-contact-detail__notes-label">Notes</div>

      <div className="ab-contact-detail__notes">{contact.notes}</div>

      {contact.addresses.map((address, idx) => (
        <div className="ab-contact-detail__address-group" key={idx}>
          <div className="ab-contact-detail__address-name">{address.name}</div>
          <div className="ab-contact-detail__address-info">
            <div className="ab-contact-detail__address-wallet">
              <FinnieKoiiIcon />
            </div>
            <div className="ab-contact-detail__address-value">{address.value}</div>
            <div className="ab-copy-icon" data-tip="Copy to clipboard">
              <CopyToClipboard text={address.value}>
                <CopyIcon />
              </CopyToClipboard>
            </div>
          </div>
        </div>
      ))}

      <div className="ab-contact-detail__did-label">{contact.didName}</div>

      <a className="ab-contact-detail__did-link" href={contact.didValue}>
        {contact.didValue}
      </a>

      <div
        className="ab-trash-icon"
        data-tip="Remove this Contact"
        data-for="remove"
        onClick={() => {
          setShowDeleteContactModal(true)
        }}
      >
        <TrashIcon />
      </div>
      <ReactTooltip place="top" effect="float" />
      <ReactTooltip id="remove" place="left" effect="float" />
    </div>
  )
}

export default ContactDetail
