// modules
import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'react-redux'

// actions
import { loadContent } from 'actions/koi'
import { setContLoading } from 'actions/continueLoading'
import { setError } from 'actions/error'
import { setNotification } from 'popup/actions/notification'

// constants
import { NOTIFICATION } from 'constants/koiConstants'

// components
import AssetList from './AssetList'
import CheckBox from 'shared/checkbox'
import ToggleButton from 'shared/ToggleButton'

// assets
import CollapseIcon from 'img/collapse-icon.svg'
import ExtendIcon from 'img/extend-icon.svg'

// styles
import './index.css'

const Assets = ({
  accounts,
  assets,
  loadContent,
  setContLoading,
  setError,
  setNotification,
  settings,
}) => {
  const [showAllAccounts, setShowAllAccounts] = useState(false)
  const [selectAccountsCollapsed, setSelectAccountCollapsed] = useState(true)
  const [accountsToShow, setAccountsToShow] = useState([])
  const [filteredAssets, setFilteredAssets] = useState([])

  useEffect(() => {
    const handleLoadContent = async () => {
      // fetch data
      try {
        setContLoading(true)
        const allNftLoaded = await loadContent()
        setContLoading(false)

        if (allNftLoaded) setNotification(NOTIFICATION.NFT_LOADED)
      } catch (err) {
        setContLoading(false)
        setError(err.message)
      }
    }

    handleLoadContent()
  }, [])

  useEffect(() => {
    let showAssets = []
    if (showAllAccounts) {
      showAssets = assets
    } else {
      showAssets = assets.filter((asset) =>
        accountsToShow.includes(asset.owner)
      )
    }

    setFilteredAssets(showAssets)
  }, [accountsToShow, showAllAccounts, assets])

  const handleSelectAccount = (e) => {
    const selectedAddress = e.target.id
    if (accountsToShow.includes(selectedAddress)) {
      setAccountsToShow(
        accountsToShow.filter((address) => address !== selectedAddress)
      )
    } else {
      setAccountsToShow([...accountsToShow, selectedAddress])
    }
  }

  const onAddAsset = () => {
    const url = chrome.extension.getURL('options.html#/create')
    chrome.tabs.create({ url })
  }

  return (
    <div className="assets-tab">
      <div className="assets-setting">
        All Accounts
        <ToggleButton value={!showAllAccounts} setValue={setShowAllAccounts} />
        Individual
        {!showAllAccounts && (
          <div
            onClick={() => setSelectAccountCollapsed(!selectAccountsCollapsed)}
            className="collapse-extend-icon"
          >
            {selectAccountsCollapsed ? (
              <ExtendIcon data-tip="Expand" />
            ) : (
              <CollapseIcon data-tip="Collapse" />
            )}
          </div>
        )}
      </div>

      {!showAllAccounts && !selectAccountsCollapsed && (
        <div className="select-accounts">
          {accounts.map((account) => (
            <div key={account.address} className="account">
              <CheckBox
                id={account.address}
                onChange={handleSelectAccount}
                defaultChecked={accountsToShow.includes(account.address)}
              />
              <label htmlFor={account.address}>{account.accountName}</label>
            </div>
          ))}
        </div>
      )}

      {filteredAssets.map((asset, index) => (
        <AssetList
          showAccountName={!showAllAccounts}
          owner={asset.owner}
          assets={asset.contents || []}
          onAddAsset={onAddAsset}
          key={index}
        />
      ))}
    </div>
  )
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  accounts: state.accounts,
})

export default connect(mapStateToProps, {
  loadContent,
  setContLoading,
  setError,
  setNotification,
})(Assets)
