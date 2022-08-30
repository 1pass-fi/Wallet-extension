import React, { useEffect, useRef, useState } from 'react'
import { connect, useSelector } from 'react-redux'
// actions
import { loadContent } from 'actions/koi'
import { setIsLoading } from 'actions/loading'
import clsx from 'clsx'
import includes from 'lodash/includes'
import isEmpty from 'lodash/isEmpty'
// components
import NFTCard from 'popup/components/NFTCard'
// selectors
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'

const Assets = ({ assets, loadContent, setIsLoading, currentProviderAddress }) => {
  const [filteredAssets, setFilteredAssets] = useState({})
  const displayingAccount = useSelector(getDisplayingAccount)

  useEffect(() => {
    const handleLoadContent = async () => {
      try {
        setIsLoading(true)
        await loadContent()
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        setError(err.message)
      }
    }

    handleLoadContent()
  }, [currentProviderAddress])

  useEffect(() => {
    let showAssets = []
    showAssets = assets.filter((asset) => displayingAccount.address === asset.owner)
    setFilteredAssets(showAssets)
  }, [displayingAccount, assets])

  const [assetsMinHeight, setAssetsMinHeight] = useState(0)
  const assetsRef = useRef(null)

  useEffect(() => {
    const assetsField = assetsRef.current
    if (assetsField) {
      const scrollHeight = assetsField.scrollHeight
      if (scrollHeight < 200) {
        setAssetsMinHeight(0)
        return
      }

      if (scrollHeight >= 200) {
        setAssetsMinHeight(350)
        return
      }
    }
  }, [filteredAssets])

  return (
    <div
      ref={assetsRef}
      style={{ minHeight: `${clsx(assetsMinHeight)}px` }}
      className="w-full bg-trueGray-100 grid grid-cols-3 gap-5 place-items-center px-3 py-1"
    >
      {filteredAssets[0]?.contents?.map((asset, idx) =>
        !includes(asset.name, 'DID Profile Page') ? <NFTCard key={idx} nft={asset} /> : null
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  assets: state.assets
})

export default connect(mapStateToProps, {
  loadContent,
  setIsLoading
})(Assets)
