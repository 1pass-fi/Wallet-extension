import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, Route, Switch } from 'react-router-dom'

import CreateIcon from 'img/v2/create-icon.svg'
import GalleryIcon from 'img/v2/gallery-icon.svg'
import CollectionIcon from 'img/v2/collection-icon.svg'

import UploadNftForm from './UploadNftForm'
import CreateCollectionForm from './CreateCollectionForm'
import EditCollectionForm from './EditCollectionForm'

import { filterNft } from 'options/actions/assets'
import { filterCollection } from 'options/actions/collections'
import AccountSettings from 'finnie-v2/components/AccountSettings'
import SortAndFilter from './SortAndFilter'
import NotificationsCenterLinks from './NotificationsCenterLinks'

const navItems = [
  { icon: CreateIcon, path: '/create-nft' },
  { icon: GalleryIcon, path: '/gallery' },
  { icon: CollectionIcon, path: '/collections' }
]

const Sidebar = () => {
  const dispatch = useDispatch()

  const [searchStr, setSearchStr] = useState('')
  const [chainType, setChainType] = useState('')
  const [sortBy, setSortBy] = useState('')

  const [searchStrCollection, setSearchStrCollection] = useState('')
  const [chainTypeCollection, setChainTypeCollection] = useState('')
  const [sortByCollection, setSortByCollection] = useState('')

  useEffect(() => {
    dispatch(filterNft({ searchStr, chainType, sortBy }))
  }, [searchStr, chainType, sortBy])

  useEffect(() => {
    dispatch(
      filterCollection({
        searchStr: searchStrCollection,
        chainType: chainTypeCollection,
        sortBy: sortByCollection
      })
    )
  }, [searchStrCollection, chainTypeCollection, sortByCollection])

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

  const handleSearchFieldChangeCollection = (searchStrCollection) => {
    setSearchStrCollection(searchStrCollection)
  }

  const handleSelectChainsCollection = (selectChainTypeCollection) => {
    if (selectChainTypeCollection === chainTypeCollection) {
      setChainTypeCollection('')
      return
    }
    setChainTypeCollection(selectChainTypeCollection)
  }

  const handleSortCollection = (sortTypeCollection) => {
    setSortByCollection(sortTypeCollection)
  }

  return (
    <>
      <nav className="flex w-57.75 items-center justify-evenly gapx-3 mb-5">
        {navItems.map(({ icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className="flex items-center justify-center w-13.75 h-11.25"
            activeClassName="rounded-t border-b border-white bg-trueGray-100 bg-opacity-20"
          >
            <Icon className="w-7.5 h-7" />
          </NavLink>
        ))}
      </nav>
      <div style={{ height: '60vh' }} className="rounded overflow-y-scroll">
        <div className="bg-trueGray-100 bg-opacity-20 rounded w-57.75">
          <Switch>
            <Route path="/create-nft">
              <UploadNftForm />
            </Route>
            <Route exact path="/collections">
              <SortAndFilter
                handleSearchFieldChange={handleSearchFieldChangeCollection}
                handleSelectChains={handleSelectChainsCollection}
                handleSort={handleSortCollection}
                sortBy={sortByCollection}
                selectedChain={chainTypeCollection}
                type="Collections"
              />
            </Route>
            <Route path="/collections/create">
              <CreateCollectionForm />
            </Route>
            <Route path="/collections/edit">
              <EditCollectionForm />
            </Route>
            <Route exact path="/settings/*">
              <AccountSettings />
            </Route>
            <Route path="/notifications">
              <NotificationsCenterLinks />
            </Route>
            <Route path="*">
              <SortAndFilter
                handleSearchFieldChange={handleSearchFieldChange}
                handleSelectChains={handleSelectChains}
                handleSort={handleSort}
                sortBy={sortBy}
                selectedChain={chainType}
              />
            </Route>
          </Switch>
        </div>
      </div>
    </>
  )
}

export default Sidebar
