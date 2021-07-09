import React from 'react'
import PropTypes from 'prop-types'

import AssetRow from '../AssetRow'
import PlusIcon from 'img/plus-icon.svg'
import './index.css'

const propTypes = {
  assets: PropTypes.array,
  onAddAsset: PropTypes.func,
}

const AssetList = ({ assets, onAddAsset }) => {
  return (
    <div className="assets">
      {assets.map((asset, index) => <AssetRow key={index} {...asset} isGrey={index % 2 === 0} />)}
      <div className="assets-add-more-row">
        <div onClick={onAddAsset} className="assets-plus-icon">
          <PlusIcon />
        </div>
      </div>
    </div>
  )
}

AssetList.propTypes = propTypes

export default AssetList
