import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getChromeStorage } from 'utils'

import { loadContent } from 'actions/koi'
import { setAssets } from 'actions/assets'

import { STORAGE } from 'constants'

import AssetList from './AssetList'

const Assets = ({ assets, setAssets, loadContent }) => {
  useEffect(() => {
    async function handleLoadContent() {
      const storage =  await getChromeStorage([STORAGE.CONTENT_LIST, STORAGE.KOI_ADDRESS])
      console.log(storage[STORAGE.CONTENT_LIST])
      if (storage[STORAGE.CONTENT_LIST]) {
        setAssets(storage[STORAGE.CONTENT_LIST])
      }
      if (storage[STORAGE.KOI_ADDRESS]) {
        loadContent()
      }
    }
    handleLoadContent()
  }, [])

  return <AssetList assets={assets} onAddAsset={() => alert('add asset')} />
}

const mapStateToProps = (state) => ({ assets: state.assets })

export default connect(mapStateToProps, { loadContent, setAssets })(Assets)
