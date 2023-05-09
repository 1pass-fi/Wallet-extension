import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import CreateIcon from 'img/v2/create-icon.svg'
import WelcomeToFinnieWallet from 'img/welcome-to-finnie-wallet.svg'
import isEmpty from 'lodash/isEmpty'
import { setIsLoading, setLoaded } from 'options/actions/loading'
import NFTCard from 'options/components/NFTCard'
import ToolTip from 'options/components/ToolTip'

import './index.css'

const Gallery = () => {
  const dispatch = useDispatch()

  const filteredNfts = useSelector((state) => state.assets.filteredNfts)
  const [displayingNfts, setDisplayingNfts] = useState(filteredNfts.slice(0, 16))
  const [dislayLength, setDisplayLength] = useState(filteredNfts.length)

  useEffect(() => {
    if (dislayLength === filteredNfts.length && displayingNfts === filteredNfts.slice(0, 16)) {
      return
    } else {
      setDisplayLength(filteredNfts.length)
      setDisplayingNfts(filteredNfts.slice(0, 16))
    }
  }, [filteredNfts])

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
    if (bottom && displayingNfts.length < filteredNfts.length) {
      dispatch(setIsLoading)
      setTimeout(() => {
        setDisplayingNfts([
          ...displayingNfts,
          ...filteredNfts.slice(displayingNfts.length, displayingNfts.length + 16)
        ])
        dispatch(setLoaded)
      }, 700)
    }
  }

  return (
    <div id="gallery" className="w-full flex justify-center items-center" onScroll={handleScroll}>
      {!isEmpty(displayingNfts) ?
        <div
          className={clsx(
            'w-full h-full gap-x-5 gap-y-10 place-items-start content-start',
            'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8'
          )}
          role="grid"
        >
          {(
            displayingNfts.map((nft) => <NFTCard nft={nft} key={nft.txId} />)
          )}
        </div> : (
          <div className='text-white text-center mt-15 flex flex-col items-center'>
            <WelcomeToFinnieWallet />
            <div className='text-2xl font-semibold'>Welcome to Finnie Wallet</div>
            <div className='text-sm font-bold mt-2'>Beyond just a wallet</div>
            <div className='text-sm font-normal'>The beginning of exchange, creation, and truly decentralization</div>
          </div>
        )
      }
    </div>
  )
}

export default Gallery
