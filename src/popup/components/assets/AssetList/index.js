// modules
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// components
import AssetRow from '../AssetRow'

// assets
import PlusIcon from 'img/plus-icon.svg'
import CollapseIcon from 'img/collapse-icon.svg'
import ExtendIcon from 'img/extend-icon.svg'

// services
import { popupAccount } from 'services/account'

// styles
import './index.css'

const propTypes = {
  assets: PropTypes.array,
  onAddAsset: PropTypes.func,
}


const AssetList = ({ owner, assets, onAddAsset }) => {
  const [ownerName, setOwnerName] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const getOwnerName = async () => {
      console.log('owner: ', owner)
      const account = await popupAccount.getAccount({ address: owner })
      const name = await account.get.accountName()
      console.log(name)
      setOwnerName(name)
    }

    getOwnerName()
  }, [])

  return (
    <div className={collapsed ? 'assets collapsed' : 'assets'}>
      <div className="owner">
        {ownerName}
        {!collapsed && <div onClick={() => setCollapsed(!collapsed)} className="collapse-icon"><CollapseIcon /></div>}
        {collapsed && <div onClick={() => setCollapsed(!collapsed)} className="collapse-icon"><ExtendIcon /></div>}
      </div>
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
