import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { REQUEST, STORAGE, ERROR_MESSAGE } from 'koiConstants'
import { setChromeStorage } from 'utils'
import { getSelectedTab } from 'utils/extension'
import { setError } from 'popup/actions/error'
import Modal from 'popup/components/shared/modal'
import ConnectedSiteRow from './connectedSiteRow'
import PlusIcon from 'img/plus-icon.svg'

import './index.css'

import storage from 'storage'

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

  const onManualConnect = async () => {
    try {
      const tab = await getSelectedTab()
      const origin = (new URL(tab.url)).origin
      const favicon = tab.favIconUrl

      if (!(await storage.generic.method.checkSitePermission(origin))) {
        await storage.generic.set.pendingRequest({
          type: REQUEST.PERMISSION,
          data: { origin, favicon }
        })
        history.push('/account/connect-site')
      } else {
        setError(ERROR_MESSAGE.ALREADY_CONNECTED_SITE)
      }
    } catch (error) {
      setError(ERROR_MESSAGE.MUST_USE_IN_POPUP)
    }
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
