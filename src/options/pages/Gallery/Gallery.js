import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import CreateIcon from 'img/v2/create-icon.svg'
import isEmpty from 'lodash/isEmpty'
import { setIsLoading, setLoaded } from 'options/actions/loading'
import NFTCard from 'options/components/NFTCard'

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
      <div className="h-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-10 place-items-start content-start">
        {!isEmpty(displayingNfts) ? (
          displayingNfts.map((nft) => <NFTCard nft={nft} key={nft.txId} />)
        ) : (
          <Link
            to={`/create-nft`}
            className="relative text-white rounded bg-blue-800 w-46.75 h-72 pt-1.75 px-1.75"
          >
            <div
              className="flex flex-col justify-center items-center w-full bg-blue-400 bg-opacity-40 rounded border border-dashed border-trueGray-100"
              style={{ height: '163px' }}
            >
              <CreateIcon className="w-8.5 h-8.5" />
              <div
                className="text-white text-sm leading-6 tracking-finnieSpacing-wide mt-4 w-32 text-center"
                style={{ width: '115px' }}
              >
                Create an Atomic NFT
              </div>
            </div>
            <div
              className="bg-blue-400 bg-opacity-25 rounded-3xl mt-2 mb-6"
              style={{ width: '151px', height: '16px' }}
            />

            <div
              className="bg-blue-400 bg-opacity-25 rounded-3xl"
              style={{ width: '99px', height: '12px' }}
            />
            <div
              className="bg-blue-400 bg-opacity-25 rounded-3xl my-1"
              style={{ width: '71px', height: '12px' }}
            />
            <div
              className="bg-blue-400 bg-opacity-25 rounded-3xl"
              style={{ width: '87px', height: '12px' }}
            />
          </Link>
        )}
      </div>
    </div>
  )
}

export default Gallery
