// modules
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// components
import AssetRow from '../AssetRow'

// assets
import PlusIcon from 'img/plus-icon.svg'

// services
import { popupAccount } from 'services/account'

// styles
import './index.css'

const propTypes = {
  assets: PropTypes.array,
}

const AssetList = ({ showAccountName, owner, assets }) => {
  const [ownerName, setOwnerName] = useState(null)

  useEffect(() => {
    const getOwnerName = async () => {
      console.log('owner: ', owner)
      const account = await popupAccount.getAccount({ address: owner })
      const name = await account.get.accountName()
      console.log(name)
      setOwnerName(name)
    }

    getOwnerName()
  }, [owner])

  return (
    <div className={'assets'}>
      {showAccountName && <div className="owner">{ownerName}</div>}
      {assets.map((asset, index) => (
        <AssetRow key={index} {...asset} isGrey={index % 2 !== 0} />
      ))}
    </div>
  )
}

AssetList.propTypes = propTypes

export default AssetList
