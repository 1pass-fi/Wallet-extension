import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, Route } from 'react-router-dom'
import clsx from 'clsx'
import initial from 'lodash/initial'
import isEmpty from 'lodash/isEmpty'
import union from 'lodash/union'

import CreateIcon from 'img/v2/create-icon.svg'
import GalleryIcon from 'img/v2/gallery-icon.svg'
import CollectionIcon from 'img/v2/collection-icon.svg'
import MagnifierIcon from 'img/v2/magnifier-icon.svg'
import FilterIcon from 'img/v2/filter-icon.svg'
import ArrowIcon from 'img/v2/arrow-icon.svg'
import CrossIcon from 'img/v2/cross-icon.svg'

import InputField from './InputField'
import Button from 'finnie-v2/components/Button'
import DropFile from 'finnie-v2/components/DropFile'
import NFTMedia from 'finnie-v2/components/NFTMedia'

import { filterNft } from 'options/actions/assets'
import { TYPE } from 'constants/accountConstants'
import formatLongString from 'finnie-v2/utils/formatLongString'
import { getFileType } from 'finnie-v2/utils/getFileType'

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
  const [nftContent, setNftContent] = useState({
    title: '',
    owner: '',
    description: '',
    isNSFW: false
  })
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [file, setFile] = useState({})

  const fileType = useMemo(() => getFileType(file), [file])
  const url = useMemo(() => {
    try {
      if (file) {
        const _url = URL.createObjectURL(file)
        return _url
      }
      return ''
    } catch (err) {
      console.log('INPUT ERROR - IMAGE', err.message)
    }
  }, [file])

  useEffect(() => {
    dispatch(filterNft({ searchStr, chainType }))
  }, [searchStr, chainType])

  const handleNftContentChange = (e) => {
    setNftContent({ ...nftContent, [e.target.name]: e.target.value })
  }

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

  const handleTagsKeyUp = (e) => {
    if (e.key === ' ' && tagInput.endsWith(', ')) {
      const newTags = initial(tagInput.split(','))
      console.log(newTags)
      setTags(union(tags, newTags))
      setTagInput('')
    }
  }

  const removeTag = (removeTag) => {
    setTags(tags.filter((tag) => tag !== removeTag))
  }

  const handleCreateNFT = () => {
    console.log(nftContent)
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
          <div className="flex flex-col px-4 pt-4 pb-8">
            <InputField
              className="my-1"
              label="NFT Title"
              value={nftContent.title}
              setValue={handleNftContentChange}
              required={true}
              name="title"
            />
            <InputField
              className="my-1"
              label="Username"
              value={nftContent.owner}
              setValue={handleNftContentChange}
              required={true}
              name="owner"
            />
            <InputField
              className="my-1"
              label="Description"
              value={nftContent.description}
              setValue={handleNftContentChange}
              required={true}
              type="textarea"
              name="description"
            />
            <div className="my-1 flex flex-col w-full">
              <label
                htmlFor="tags"
                className="w-full uppercase text-lightBlue text-2xs leading-3 mb-1"
              >
                Tags
              </label>
              <input
                className="w-full bg-trueGray-100 bg-opacity-10 border-b border-white h-5.25 text-white"
                name="tags"
                placeholder="Tags,"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyUp={(e) => handleTagsKeyUp(e)}
              />

              <div className="text-warning mt-1 uppercase text-3xs">
                Separate with a “,” and hit space bar
              </div>
            </div>
            <div className="max-h-19 w-full flex flex-wrap gap-1 overflow-y-scroll mt-1 mb-5">
              {tags.map((tag) => (
                <div
                  onClick={() => removeTag(tag)}
                  key={tag}
                  className="max-h-3.75 flex justify-evenly items-center rounded-full bg-lightBlue text-2xs py-0.5 px-1.5 cursor-pointer"
                >
                  <CrossIcon className="mr-0.5 w-1.75 h-1.75" />
                  {formatLongString(tag, 25)}
                </div>
              ))}
            </div>

            <div className="flex mb-4 cursor-pointer">
              <input
                className="rounded-sm border border-white w-3.75 h-3.75"
                name="isNSFW"
                type="checkbox"
                checked={nftContent.isNSFW}
                onChange={() => setNftContent((prev) => ({ ...prev, isNSFW: !prev.isNSFW }))}
              ></input>
              <div
                className="text-white ml-2 text-11px select-none"
                onClick={() => setNftContent((prev) => ({ ...prev, isNSFW: !prev.isNSFW }))}
              >
                This content is <span className="text-warning">Explicit or 18+.</span>
              </div>
            </div>

            <div className="w-50 h-36.25 border border-dashed border-success rounded mb-4.25">
              {!isEmpty(file) ? (
                <div className="w-full h-full relative object-cover">
                  <CrossIcon
                    onClick={() => setFile({})}
                    className="z-50 absolute top-2 right-2 w-4 h-4 cursor-pointer bg-white rounded-full p-1 shadow-lg"
                  />
                  <NFTMedia contentType={fileType} source={url} />
                </div>
              ) : (
                <DropFile
                  file={file}
                  setFile={setFile}
                  fileType={['image/*', 'video/*', 'audio/*']}
                  // className="drag-media"
                  className="w-full h-full"
                  description="Click to upload an Atomic NFT"
                />
              )}
            </div>

            <Button
              onClick={handleCreateNFT}
              variant="light"
              text="Create NFT"
              className="text-sm font-semibold"
            />
          </div>
        </Route>
      </div>
    </div>
  )
}

export default Sidebar
