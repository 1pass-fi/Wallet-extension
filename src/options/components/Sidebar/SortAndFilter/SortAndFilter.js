import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
import ArrowIcon from 'img/v2/arrow-icon.svg'
import FilterIcon from 'img/v2/filter-icon.svg'
import MagnifierIcon from 'img/v2/magnifier-icon.svg'
import { SORT_TYPES } from 'options/actions/assets'
import ToggleButton from 'options/components/ToggleButton'

import './SortAndFilter.css'

const SortAndFilter = ({
  handleSearchFieldChange,
  handleSelectChains,
  selectedChain,
  sortBy,
  handleSort,
  type = 'Gallery'
}) => {
  const [showFilters, setShowFilters] = useState(false)
  const [showFilterChains, setShowFilterChains] = useState(false)
  const [showSortBy, setShowSortBy] = useState(false)

  useEffect(() => {
    setShowSortBy(showFilters)
    setShowFilterChains(showFilters)
  }, [showFilters])

  useEffect(() => {
    if (showFilterChains && showSortBy) {
      setShowFilters(true)
    }

    if (!showFilterChains && !showSortBy) {
      setShowFilters(false)
    }
  }, [showFilterChains, showSortBy])

  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          className="w-full h-8.5 pl-3.5 pr-11.25 rounded-t text-indigo-900 text-sm placeholder-current side-bar-search-field"
          placeholder={type === 'Gallery' ? chrome.i18n.getMessage('searchNfts') : chrome.i18n.getMessage('Search Collections')}
          onChange={(e) => handleSearchFieldChange(e.target.value)}
        ></input>
        <MagnifierIcon className="absolute top-2 right-5 w-4.75 h-4.75 cursor-pointer" />
      </div>
      <div className="px-2 pb-9">
        <div
          onClick={() => {
            setShowFilters(!showFilters)
          }}
          className="flex items-center justify-between h-12 3xl:h-13 pl-1.5 pr-3 font-semibold text-sm 3xl:text-base text-white"
        >
          Filters
          <FilterIcon
            className={clsx(showFilters && 'transform rotate-90', 'w-5.25 h-5.25 cursor-pointer')}
          />
        </div>
        <hr className="rounded bg-white" />
        {type === 'Gallery' && (
          <>
            <div
              onClick={() => setShowSortBy(!showSortBy)}
              className="flex items-center justify-between h-12 3xl:h-13 pl-1.5 pr-3 font-semibold text-sm 3xl:text-base text-white cursor-pointer"
            >
              Sort By
              <ArrowIcon
                className={clsx(showSortBy && 'transform rotate-90', 'w-1.5 h-3 cursor-pointer')}
              />
            </div>
            <hr className="rounded border border-trueGray-100 border-opacity-20" />
            {showSortBy && (
              <div className="flex text-white text-xs gap-x-2.5 gap-y-2 items-center flex-wrap text-center mt-2.75">
                <ToggleButton
                  isActive={sortBy === SORT_TYPES.NEWEST}
                  onClick={() => handleSort(SORT_TYPES.NEWEST)}
                  text={chrome.i18n.getMessage('RecentlyAdded')}
                />
                <ToggleButton
                  isActive={sortBy === SORT_TYPES.OLDEST}
                  onClick={() => handleSort(SORT_TYPES.OLDEST)}
                  text={chrome.i18n.getMessage('Oldest')}
                />
                <ToggleButton
                  isActive={sortBy === SORT_TYPES.MOST_VIEWED}
                  onClick={() => handleSort(SORT_TYPES.MOST_VIEWED)}
                  text={chrome.i18n.getMessage('MostViewed')}
                />
              </div>
            )}
          </>
        )}
        <div
          onClick={() => setShowFilterChains(!showFilterChains)}
          className="flex items-center justify-between h-12 3xl:h-13 pl-1.5 pr-3 font-semibold text-sm 3xl:text-base text-white cursor-pointer"
        >
          Chains
          <ArrowIcon
            className={clsx(showFilterChains && 'transform rotate-90', 'w-1.5 h-3 cursor-pointer')}
          />
        </div>
        <hr className="rounded border border-trueGray-100 border-opacity-20" />
        {showFilterChains && (
          <div className="flex text-white text-xs gap-x-2.5 gap-y-2 items-center flex-wrap text-center mt-2.75">
            <ToggleButton
              isActive={selectedChain === TYPE.ETHEREUM}
              onClick={() => handleSelectChains(TYPE.ETHEREUM)}
              text="ETHEREUM"
            />
            <ToggleButton
              isActive={selectedChain === TYPE.ARWEAVE}
              onClick={() => handleSelectChains(TYPE.ARWEAVE)}
              text="ARWEAVE"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SortAndFilter
