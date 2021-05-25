import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { REQUEST, STORAGE } from 'constants'
import { setChromeStorage, checkSitePermission } from 'utils'
import { setError } from 'popup/actions/error'
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

const ManualConnectSite = ({ isGreyBackground, setError }) => {
  const history = useHistory()

  const onManualConnect = () => {
    chrome.tabs.getSelected(null, async (tab) => {
      const origin = (new URL(tab.url)).origin
      const favicon = tab.favIconUrl

      if (!(await checkSitePermission(origin))) {
        await setChromeStorage({
          [STORAGE.PENDING_REQUEST]: {
            type: REQUEST.PERMISSION,
            data: { origin, favicon }
          }
        })
        history.push('/account/connect-site')
      } else {
        setError('This site has already connected')
      }
    })
  }
  return (
    <div
      className='manual-connect-container'
      onClick={onManualConnect}
      style={{ background: isGreyBackground ? '#eeeeee' : '#ffffff' }}
    >
      <button className='manual-connect-button'>
        <div className='plus-icon'>
          <PlusIcon />
        </div>
      </button>
      <div className='manual-connect-label'>manually connect to current site</div>
    </div>
  )
}

const RemoveConnectedSites = ({ sites, accountName, handleDeleteSite, onClose, setError }) => {
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
      <ManualConnectSite
        setError={setError}
        isGreyBackground={sites.length % 2 === 0}
      />
    </Modal>
  )
}

RemoveConnectedSites.propTypes = propTypes

export default connect(null, { setError })(RemoveConnectedSites)
