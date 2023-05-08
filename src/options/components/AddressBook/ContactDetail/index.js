import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactTooltip from 'react-tooltip'
import { TYPE } from 'constants/accountConstants'
import Avatar from 'img/ab-avatar.png'
import CloseIcon from 'img/ab-close-icon.svg'
import CopyIcon from 'img/copy-icon.svg'
import EditIcon from 'img/edit-icon-collection.svg'
import EthereumIcon from 'img/ethereum-icon.svg'
import ArweaveIcon from 'img/finnie-koi-white-icon.svg'
import TrashIcon from 'img/trash-bin.svg'
import K2Icon from 'img/v2/k2-logos/finnie-k2-logo.svg'
import SolanaIcon from 'img/v2/solana-logo.svg'
import isEmpty from 'lodash/isEmpty'

import Button from '../Button'

import './index.css'

const ContactDetail = ({ contact, onClose, showEditForm, setShowDeleteContactModal }) => {
  return (
    <div className="ab-contact-detail">
      <div className="ab-contact-detail__header">
        <Button
          startIcon={EditIcon}
          onClick={showEditForm}
          text={chrome.i18n.getMessage('edit')}
          variant="normal"
        />
        <div className="ab-close-icon" onClick={onClose}>
          <CloseIcon />
        </div>
      </div>

      <img
        className="ab-contact-detail__avatar"
        src={isEmpty(contact.avatarUrl) ? Avatar : contact.avatarUrl}
        alt="avatar"
      />

      <div className="ab-contact-detail__name">{contact.name}</div>

      <div className="ab-contact-detail__notes-label">Notes</div>

      <div className="ab-contact-detail__notes">{contact.notes}</div>

      {contact.addresses?.map((address, idx) => (
        <div className="ab-contact-detail__address-group" key={idx}>
          <div className="ab-contact-detail__address-name">{address.name}</div>
          <div className="ab-contact-detail__address-info">
            <div
              className="ab-contact-detail__address-wallet"
              style={{ width: '29px', height: '29px' }}
            >
              {address.type === TYPE.ARWEAVE && <ArweaveIcon />}
              {address.type === TYPE.ETHEREUM && <EthereumIcon />}
              {address.type === TYPE.SOLANA && <SolanaIcon />}
              {address.type === TYPE.K2 && <K2Icon />}
            </div>
            <div className="ab-contact-detail__address-value">{address.value}</div>
            <div className="ab-copy-icon" data-tip={chrome.i18n.getMessage('copyToClipboard')}>
              <CopyToClipboard text={address.value}>
                <CopyIcon />
              </CopyToClipboard>
            </div>
          </div>
        </div>
      ))}

      {/* <div className="ab-contact-detail__did-label">{contact.didName}</div>

      <a className="ab-contact-detail__did-link" href={contact.didValue}>
        {contact.didValue}
      </a> */}

      <div
        className="ab-trash-icon"
        data-tip={chrome.i18n.getMessage('removeThisContact')}
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
