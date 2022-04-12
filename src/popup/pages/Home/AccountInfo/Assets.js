import React, { useEffect, useRef, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import clsx from 'clsx'
import includes from 'lodash/includes'

// components
import NFTCard from 'popup/components/NFTCard'

// selectors
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'

const Assets = ({ assets }) => {
  const [filteredAssets, setFilteredAssets] = useState({})
  const displayingAccount = useSelector(getDisplayingAccount)

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

export default connect(mapStateToProps)(Assets)
