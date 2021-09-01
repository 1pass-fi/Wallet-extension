import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { loadContent } from 'actions/koi'
import { setAssets } from 'actions/assets'

import { NOTIFICATION } from 'constants/koiConstants'

import AssetList from './AssetList'
import { setContLoading } from 'actions/continueLoading'
import { setError } from 'popup/actions/error'
import { setNotification } from 'popup/actions/notification'
import { popupAccount } from 'services/account'

const Assets = ({ 
  assets, 
  setAssets, 
  loadContent, 
  isContLoading, 
  setContLoading, 
  setError, 
  setNotification }) => {

  useEffect(() => {
    async function handleLoadContent() {
      // load from local storage
      const allAccounts = await popupAccount.getAllAccounts()
      const allAssets = []

      await Promise.all(allAccounts.map(async account => {
        const assets = await account.get.assets() || []
        const address = await account.get.address()

        const accountAssets = { owner: address, contents: assets }
        allAssets.push(accountAssets)
      }))

      setAssets(allAssets)
      

      // fetch data
      if (!isContLoading) {
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
    }
    handleLoadContent()
  }, [])

  const onAddAsset = () => {
    const url = chrome.extension.getURL('options.html#/create')
    chrome.tabs.create({ url })
  }
  return (
    <div>
      {
        assets.map((asset, index) => <AssetList 
          owner={asset.owner} 
          assets={asset.contents || []} 
          onAddAsset={onAddAsset} 
          key={index}
        />)
      }
    </div>
  )
}

const mapStateToProps = (state) => ({ assets: state.assets, isContLoading: state.contLoading })

export default connect(mapStateToProps, { loadContent, setAssets, setContLoading, setError, setNotification })(Assets)
