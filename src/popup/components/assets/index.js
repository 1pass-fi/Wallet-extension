import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getChromeStorage } from 'utils'

import { loadContent } from 'actions/koi'
import { setAssets } from 'actions/assets'

import { NOTIFICATION, STORAGE } from 'koiConstants'

import AssetList from './AssetList'
import { setContLoading } from 'actions/continueLoading'
import { setError } from 'popup/actions/error'
import { setNotification } from 'popup/actions/notification'

const Assets = ({ assets, setAssets, loadContent, isContLoading, setContLoading, setError, setNotification }) => {
  useEffect(() => {
    async function handleLoadContent() {
      const storage = await getChromeStorage([STORAGE.CONTENT_LIST, STORAGE.KOI_ADDRESS])
      if (storage[STORAGE.CONTENT_LIST]) {
        setAssets(storage[STORAGE.CONTENT_LIST])
      }
      if (storage[STORAGE.KOI_ADDRESS] && !isContLoading) {
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

  return (<AssetList assets={assets} onAddAsset={() => alert('add asset')} />)
}

const mapStateToProps = (state) => ({ assets: state.assets, isContLoading: state.contLoading })

export default connect(mapStateToProps, { loadContent, setAssets, setContLoading, setError, setNotification })(Assets)
