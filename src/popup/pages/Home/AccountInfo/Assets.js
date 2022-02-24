import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'

// actions
import { loadContent } from 'actions/koi'
import { setContLoading } from 'actions/continueLoading'

// components
import NFTCard from 'popup/components/NFTCard'

const Assets = ({ assets, loadContent, setContLoading }) => {
  const [filteredAssets, setFilteredAssets] = useState({})
  const defaultAccount = useSelector((state) => state.defaultAccount)

  useEffect(() => {
    const handleLoadContent = async () => {
      try {
        setContLoading(true)
        const allNftLoaded = await loadContent()
        setContLoading(false)
      } catch (err) {
        setContLoading(false)
        setError(err.message)
      }
    }

    handleLoadContent()
  }, [])

  useEffect(() => {
    let showAssets = []
    showAssets = assets.filter((asset) => defaultAccount.address === asset.owner)
    setFilteredAssets(showAssets)
  }, [defaultAccount, assets])

  return (
    <div className="w-full bg-trueGray-100 grid grid-cols-3 gap-5 place-items-center px-3 py-1">
      {filteredAssets[0]?.contents?.map((asset, idx) => (
        <NFTCard key={idx} nft={asset} />
      ))}
    </div>
  )
}

const mapStateToProps = (state) => ({
  assets: state.assets
})

export default connect(mapStateToProps, {
  loadContent,
  setContLoading
})(Assets)
