// modules
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
// constants
import { ERROR_MESSAGE,REQUEST } from 'constants/koiConstants'
// assets
import PlusIcon from 'img/plus-icon.svg'
// actions
import { setError } from 'popup/actions/error'
// components
import Modal from 'popup/components/shared/modal'
import PropTypes from 'prop-types'
// services
import storage from 'services/storage'
import { getSelectedTab } from 'utils/extension'

import ConnectedSiteRow from './connectedSiteRow'

// styles
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

const ManualConnectSite = ({ isGreyBackground, setError, sites }) => {
  const history = useHistory()

  const onManualConnect = async () => {
    try {
      const tab = await getSelectedTab()
      const origin = (new URL(tab.url)).origin
      const favicon = tab.favIconUrl
      if (!(sites.includes(origin))) {
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

const RemoveConnectedSites = ({ accountName, onClose, setError, account }) => {
  const [sites, setSites] = useState([]) 

  const handleDeleteSite = async (inputSite) => {
    const siteAddressDictionary = await storage.setting.get.siteAddressDictionary()
    delete siteAddressDictionary[inputSite]
    await storage.setting.set.siteAddressDictionary(siteAddressDictionary)

    let _sites = sites.filter(site => site !== inputSite)
    setSites(_sites)
  }

  useEffect(() => {
    const loadConnectedSites = async () => {
      const address = account.address
      const siteAddressDictionary = await storage.setting.get.siteAddressDictionary()
      let sites = Object.keys(siteAddressDictionary)
      sites = sites.filter(site => siteAddressDictionary[site] == address)
      setSites(sites)
    }

    loadConnectedSites()
  }, [])

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
        sites={sites}
      />
    </Modal>
  )
}

RemoveConnectedSites.propTypes = propTypes

export default connect(null, { setError })(RemoveConnectedSites)
