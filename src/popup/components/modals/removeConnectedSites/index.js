import React from 'react'
import PropTypes from 'prop-types'

import Modal from 'popup/components/shared/modal/index'
import ConnectedSiteRow from './connectedSiteRow/index'

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

const ManualConnectSite = ({isGreyBackground}) => {
  return (
    <div className='manual-connect-container' style={{ background: isGreyBackground ? '#eeeeee' : '#ffffff'}}>
      <button className='manual-connect-button'>
        <div className='plus-icon'>
          <PlusIcon />
        </div>
      </button>
      <div className='manual-connect-label'>manually connect to current site</div>
    </div>
  )
}

const RemoveConnectedSites = ({ sites, accountName }) => {
  return (
    <Modal>
      <ModalTitle accountName={accountName} />
      {sites.map((element, index) => {
        return (
          <ConnectedSiteRow
            site={{...element}}
            key={element.name}
            isGreyBackground={index % 2 === 0}
          />
        )
      })}
      <ManualConnectSite isGreyBackground={sites.length % 2 === 0}/>
    </Modal>
  )
}

RemoveConnectedSites.propTypes = propTypes

export default RemoveConnectedSites
