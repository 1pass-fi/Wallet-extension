import React from 'react'
import PropTypes from 'prop-types'
import DeleteIcon from 'img/wallet/delete-icon.svg'

import './index.css'

const propTypes = {
  site: PropTypes.object,
  isGreyBackgroud: PropTypes.bool
}

const ConnectedSiteRow = ({ site, isGreyBackground }) => {
  return (
    <div className='connected-site-row' style={{background: isGreyBackground ? '#eeeeee' : '#ffffff'}}>
      <div className='connected-site-name'>{site.name}</div>
      <button className='delete-button'>
        <div className='delete-icon'>
          <DeleteIcon />
        </div>
      </button>
    </div>
  )
}

ConnectedSiteRow.propTypes = propTypes

export default ConnectedSiteRow
