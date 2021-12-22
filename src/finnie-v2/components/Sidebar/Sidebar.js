import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, Route } from 'react-router-dom'

import CreateIcon from 'img/v2/create-icon.svg'
import GalleryIcon from 'img/v2/gallery-icon.svg'
import CollectionIcon from 'img/v2/collection-icon.svg'

import UploadNftForm from './UploadNftForm'
import { filterNft } from 'options/actions/assets'
import AccountSettings from 'finnie-v2/components/AccountSettings'
import SortAndFilter from './SortAndFilter/SortAndFilter'

const navItems = [
  { icon: CreateIcon, path: '/v2/create' },
  { icon: GalleryIcon, path: '/v2/gallery' },
  { icon: CollectionIcon, path: '/v2/collection' }
]

const Sidebar = () => {
  const dispatch = useDispatch()

  const [searchStr, setSearchStr] = useState('')
  const [chainType, setChainType] = useState('')
  const [sortBy, setSortBy] = useState('')

  useEffect(() => {
    dispatch(filterNft({ searchStr, chainType, sortBy }))
  }, [searchStr, chainType, sortBy])

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

  const handleSort = (sortType) => {
    setSortBy(sortType)
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
          <SortAndFilter
            handleSearchFieldChange={handleSearchFieldChange}
            handleSelectChains={handleSelectChains}
            handleSort={handleSort}
            sortBy={sortBy}
            selectedChain={chainType}
          />
        </Route>
        <Route path="/v2/create">
          <UploadNftForm />
        </Route>
        <Route exact path="/v2/settings/*">
          <AccountSettings />
        </Route>
      </div>
    </div>
  )
}

export default Sidebar
