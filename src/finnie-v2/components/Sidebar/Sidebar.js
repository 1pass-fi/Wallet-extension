import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, Route } from 'react-router-dom'
import clsx from 'clsx'

import CreateIcon from 'img/v2/create-icon.svg'
import GalleryIcon from 'img/v2/gallery-icon.svg'
import CollectionIcon from 'img/v2/collection-icon.svg'
import MagnifierIcon from 'img/v2/magnifier-icon.svg'
import FilterIcon from 'img/v2/filter-icon.svg'
import ArrowIcon from 'img/v2/arrow-icon.svg'

import UploadNftForm from 'finnie-v2/components/UploadNftForm'
import { filterNft } from 'options/actions/assets'
import { TYPE } from 'constants/accountConstants'

const navItems = [
  { icon: CreateIcon, path: '/v2/create' },
  { icon: GalleryIcon, path: '/v2/gallery' },
  { icon: CollectionIcon, path: '/v2/collection' }
]

const Sidebar = () => {
  const dispatch = useDispatch()

  const [searchStr, setSearchStr] = useState('')
  const [showFilterChains, setShowFilterChains] = useState(false)
  const [chainType, setChainType] = useState('')

  useEffect(() => {
    dispatch(filterNft({ searchStr, chainType }))
  }, [searchStr, chainType])

  const handleSearchFieldChange = (searchStr) => {
    setSearchStr(searchStr)
  }

  const handleSelectChains = (selectChainType) => {
    if (selectChainType === chainType) {
      setChainType('')
      return
    }
    setChainType(selectChainType)
  }

  return (
    <div>
      <nav className="flex items-center justify-evenly gapx-3 mb-5">
        {navItems.map(({ icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className="flex items-center justify-center w-13.75 h-11.25"
            activeClassName="rounded bg-trueGray-100 bg-opacity-20"
          >
            <Icon className="w-7.5 h-7" />
          </NavLink>
        ))}
      </nav>
      <div className="bg-trueGray-100 bg-opacity-20 rounded">
        <Route path="/v2/gallery">
          <div className="relative w-full">
            <input
              className="w-full h-8.5 pl-3.5 pr-11.25 rounded-t text-indigo-900 font-light text-sm placeholder-current"
              placeholder="Search NFTs"
              onChange={(e) => handleSearchFieldChange(e.target.value)}
            ></input>
            <MagnifierIcon className="absolute top-2 right-5 w-4.75 h-4.75 cursor-pointer" />
          </div>
          <div className="px-2 pb-9">
            <div className="flex items-center justify-between h-12 pl-1.5 pr-3 font-semibold text-sm text-white">
              Filters
              <FilterIcon className="w-5.25 h-5.25 cursor-pointer" />
            </div>
            <hr className="rounded bg-white" />
            <div className="flex items-center justify-between h-12 pl-1.5 pr-3 font-semibold text-sm text-white">
              Chains
              <ArrowIcon
                className={clsx(
                  showFilterChains && 'transform rotate-90',
                  'w-1.5 h-3 cursor-pointer'
                )}
                onClick={() => setShowFilterChains(!showFilterChains)}
              />
            </div>
            <hr className="rounded border border-trueGray-100 border-opacity-20" />
            {showFilterChains && (
              <div className="flex text-white text-xs justify-between items-center text-center mt-2.75">
                <div
                  className={clsx(
                    chainType === TYPE.ETHEREUM ? 'bg-lightBlue text-indigo' : 'border-white',
                    'h-7 w-24 border text-white text-xs rounded flex items-center justify-center cursor-pointer finnieSpacing-wider'
                  )}
                  onClick={() => handleSelectChains(TYPE.ETHEREUM)}
                >
                  Ethereum
                </div>
                <div
                  className={clsx(
                    chainType === TYPE.ARWEAVE ? 'bg-lightBlue text-indigo' : 'border-white',
                    'h-7 w-24 border border-white rounded flex items-center justify-center cursor-pointer finnieSpacing-wider'
                  )}
                  onClick={() => handleSelectChains(TYPE.ARWEAVE)}
                >
                  Arweave
                </div>
              </div>
            )}
          </div>
        </Route>
        <Route path="/v2/create">
          <UploadNftForm />
        </Route>
      </div>
    </div>
  )
}

export default Sidebar
