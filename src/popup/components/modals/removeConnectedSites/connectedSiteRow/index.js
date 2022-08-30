// modules
import React from 'react'
// assets
import DeleteIcon from 'img/wallet/delete-icon.svg'
// components
import PropTypes from 'prop-types'

// styles
import './index.css'

const propTypes = {
  site: PropTypes.string,
  isGreyBackground: PropTypes.bool
}

const ConnectedSiteRow = ({ site, isGreyBackground, handleDeleteSite }) => {
  return (
    <div className='connected-site-row' style={{ background: isGreyBackground ? '#eeeeee' : '#ffffff' }}>
      <div className='connected-site-name'>{site}</div>
      <button className='delete-button'>
        <div className='delete-icon'>
          <DeleteIcon onClick={() => handleDeleteSite(site)} />
        </div>
      </button>
    </div>
  )
}

ConnectedSiteRow.propTypes = propTypes

export default ConnectedSiteRow
