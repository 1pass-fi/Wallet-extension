import React from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, Route } from 'react-router-dom'

import CreateIcon from 'img/v2/create-icon.svg'
import GalleryIcon from 'img/v2/gallery-icon.svg'
import CollectionIcon from 'img/v2/collection-icon.svg'
import MagnifierIcon from 'img/v2/magnifier-icon.svg'
import SettingIcon from 'img/v2/setting-icon.svg'
import { filterNft } from 'options/actions/assets'

const navItems = [
  { icon: CreateIcon, path: '/v2/create' },
  { icon: GalleryIcon, path: '/v2/gallery' },
  { icon: CollectionIcon, path: '/v2/collection' },
  { icon: SettingIcon, path: '/v2/settings' }
]

const Sidebar = () => {
  const dispatch = useDispatch()

  const handleSearchFieldChange = (searchStr) => {
    dispatch(filterNft(searchStr))
  }

  return (
    <div>
      <nav className="flex items-center justify-between gapx-3 mb-5">
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
      <div>
        <Route path="/v2/gallery">
          <div className="relative w-full">
            <input
              className="w-full h-8.5 pl-5 pr-11.25 rounded-t text-indigo-900 font-light text-sm placeholder-current"
              placeholder="Search NFTs"
              onChange={(e) => handleSearchFieldChange(e.target.value)}
            ></input>
            <MagnifierIcon className="absolute top-2 right-5 w-4.75 h-4.75" />
          </div>
        </Route>
      </div>
    </div>
  )
}

export default Sidebar
