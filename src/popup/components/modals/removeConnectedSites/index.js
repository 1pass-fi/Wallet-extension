import React from 'react'
import PropTypes from 'prop-types'

import Modal from 'popup/components/shared/modal'
import ConnectedSiteRow from './connectedSiteRow'

import PlusIcon from 'img/plus-icon.svg'

import './index.css'

const propTypes = {
  sites: PropTypes.array,
  accountName: PropTypes.string,
}

const ModalTitle = ({ accountName }) => {
  return (
    <div className="modal-title remove-sites-modal">
      {accountName} is connected to these sites.
      <br />
      They can view your account address.
    </div>
  )
}

const ManualConnectSite = ({ isGreyBackground }) => {
  return (
    <div className='manual-connect-container' style={{ background: isGreyBackground ? '#eeeeee' : '#ffffff' }}>
      <button className='manual-connect-button'>
        <div className='plus-icon'>
          <PlusIcon />
        </div>
      </button>
      <div className='manual-connect-label'>manually connect to current site</div>
    </div>
  )
}

const RemoveConnectedSites = ({ sites, accountName, handleDeleteSite, onClose }) => {
  return (
    <Modal onClose={onClose}>
      <ModalTitle accountName={accountName} />
      {sites.map((site, index) => {
        return (
          <ConnectedSiteRow
            site={site}
            key={index}
            isGreyBackground={index % 2 === 0}
            handleDeleteSite={handleDeleteSite}
          />
        )
      })}
      <ManualConnectSite isGreyBackground={sites.length % 2 === 0} />
    </Modal>
  )
}

RemoveConnectedSites.propTypes = propTypes

export default RemoveConnectedSites
