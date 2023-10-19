import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, Route, Switch } from 'react-router-dom'
import clsx from 'clsx'
import CollectionIcon from 'img/v2/collection-icon.svg'
import CreateIcon from 'img/v2/create-icon.svg'
import GalleryIcon from 'img/v2/gallery-icon.svg'
import CloseIcon from 'img/v2/x-icon-white.svg'
import { filterNft } from 'options/actions/assets'
import { filterCollection } from 'options/actions/collections'
import AccountSettings from 'options/components/AccountSettings'
import ToolTip from 'options/components/ToolTip'
import HasArweave from 'options/shared/hasArweave'

import CollectionForm from './CollectionForm'
import NotificationsCenterLinks from './NotificationsCenterLinks'
import SortAndFilter from './SortAndFilter'
import UploadNftForm from './UploadNftForm'

import './Sidebar.css'

const navItems = [
  // { icon: CreateIcon, path: '/create-nft' },
  { icon: GalleryIcon, path: '/gallery' }
  // { icon: CollectionIcon, path: '/collections' }
]

const Sidebar = ({ currentPath }) => {
  const dispatch = useDispatch()

  const [searchStr, setSearchStr] = useState('')
  const [chainType, setChainType] = useState('')
  const [sortBy, setSortBy] = useState('')

  const [searchStrCollection, setSearchStrCollection] = useState('')
  const [chainTypeCollection, setChainTypeCollection] = useState('')
  const [sortByCollection, setSortByCollection] = useState('')

  const [showCollectionTooltip, setShowCollectionTooltip] = useState(true)

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
    <div className="w-61 3xl:w-65.5">
      <div style={{ height: '60vh' }} className="rounded overflow-y-scroll">
        <div className="bg-trueGray-100 bg-opacity-20 rounded w-58.5 3xl:w-64">
          <Switch>
            <Route path="/create-nft">
              <HasArweave content={chrome.i18n.getMessage('createNFTsArweaveSupported')}>
                <UploadNftForm />
              </HasArweave>
            </Route>
            <Route path="/collections/create">
              <HasArweave content={chrome.i18n.getMessage('createNFTsArweaveSupported')}>
                <CollectionForm />
              </HasArweave>
            </Route>
            <Route path="/collections/edit">
              <CollectionForm isUpdate={true} />
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
    </div>
  )
}

export default Sidebar
