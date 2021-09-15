// modules
import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'react-redux'

// actions
import { loadContent } from 'actions/koi'
import { setContLoading } from 'actions/continueLoading'
import { setError } from 'actions/error'
import { setNotification } from 'popup/actions/notification'
import { setAssetsTabSettings } from 'popup/actions/assetsSettings'

// constants
import { NOTIFICATION } from 'constants/koiConstants'

// components
import AssetList from './AssetList'
import CheckBox from 'shared/checkbox'
import ToggleButton from 'shared/ToggleButton'

// assets
import CollapseIcon from 'img/collapse-icon.svg'
import ExtendIcon from 'img/extend-icon.svg'

// services
import storage from 'services/storage'

// styles
import './index.css'

const Assets = ({
  accounts,
  assets,
  loadContent,
  setContLoading,
  setError,
  setNotification,
  assetsSettings: { showAllAccounts, selectAccountsCollapsed, accountsToShow },
  setAssetsTabSettings,
}) => {
  const [filteredAssets, setFilteredAssets] = useState([])

  const updateSettings = async (settings) => {
    const newSettings = {
      showAllAccounts,
      selectAccountsCollapsed,
      accountsToShow,
      ...settings,
    }

    setAssetsTabSettings(newSettings)
    await storage.setting.set.assetsTabSettings(newSettings)
  }

  const setShowAllAccounts = async (_showAllAccounts) => {
    await updateSettings({ showAllAccounts: _showAllAccounts })
  }

  const setSelectAccountCollapsed = async (_selectAccountsCollapsed) => {
    await updateSettings({ selectAccountsCollapsed: _selectAccountsCollapsed })
  }

  const setAccountsToShow = async (_accountsToShow) => {
    await updateSettings({ accountsToShow: _accountsToShow })
  }

  const handleSelectAccount = async (e) => {
    const selectedAddress = e.target.id
    if (accountsToShow.includes(selectedAddress)) {
      await setAccountsToShow(
        accountsToShow.filter((address) => address !== selectedAddress)
      )
    } else {
      await setAccountsToShow([...accountsToShow, selectedAddress])
    }
  }

  useEffect(() => {
    const handleLoadContent = async () => {
      // fetch data
      try {
        setContLoading(true)
        const allNftLoaded = await loadAllContent()
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
          key={index}
        />
      ))}
    </div>
  )
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  accounts: state.accounts,
  assetsSettings: state.assetsSettings,
})

export default connect(mapStateToProps, {
  loadContent,
  setContLoading,
  setError,
  setNotification,
  setAssetsTabSettings,
})(Assets)
