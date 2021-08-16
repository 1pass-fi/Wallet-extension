import React, { useState, useEffect } from 'react'
import { TYPE } from 'account/accountConstants' 
import PropTypes from 'prop-types'

import AssetRow from '../AssetRow'
import PlusIcon from 'img/plus-icon.svg'
import './index.css'
import CollapseIcon from 'img/collapse-icon.svg'
import ExtendIcon from 'img/extend-icon.svg'

import { popupAccount } from 'account'

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
