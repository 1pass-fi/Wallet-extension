import React, { useState } from 'react'
import { useEffect } from 'react'
import initial from 'lodash/initial'
import union from 'lodash/union'

import NFTMedia from 'finnie-v2/components/NFTMedia'
import InputField from 'finnie-v2/components/InputField'
import formatLongString from 'finnie-v2/utils/formatLongString'

import CrossIcon from 'img/v2/cross-icon.svg'

const EditNftInfo = ({ currentNftIdx, nftInfo, file, updateNftInfo, tagInputs, setTagInputs }) => {
  const [nftDetail, setNftDetail] = useState(nftInfo)

  useEffect(() => {
    setNftDetail(nftInfo)
  }, [nftInfo])

  const handleNftContentChange = (e, idx) => {
    let updatedNftDetail = { ...nftDetail }

    if (e.target.name === 'isNSFW') updatedNftDetail = { ...updatedNftDetail, [e.target.name]: e.target.checked }
    else updatedNftDetail = { ...updatedNftDetail, [e.target.name]: e.target.value }

    setNftDetail(updatedNftDetail)
    updateNftInfo(idx, updatedNftDetail)
  }

  const removeTag = (removeTag, idx) => {
    let updatedNftDetail = { ...nftDetail }
    updatedNftDetail.tags = updatedNftDetail.tags.filter((tag) => tag !== removeTag)

    updatedNftDetail = { ...updatedNftDetail, tags: updatedNftDetail.tags }
    setNftDetail(updatedNftDetail)
    updateNftInfo(idx, updatedNftDetail)
  }

  const handleTagsKeyUp = (e, idx) => {
    if (e.key === ' ' && tagInputs[idx].endsWith(', ')) {
      let updatedNftDetail = { ...nftDetail }
      const newTags = initial(tagInputs[idx].split(','))
      updatedNftDetail.tags = union(updatedNftDetail.tags, newTags)

      updatedNftDetail = { ...updatedNftDetail, tags: updatedNftDetail.tags }
      setNftDetail(updatedNftDetail)

      updateNftInfo(idx, updatedNftDetail)

      let updatedTagInputs = [...tagInputs]
      updatedTagInputs[idx] = ''
      setTagInputs(updatedTagInputs)
    }
  }

  return (
    <>
      <div className="text-xl text-white">EDIT NFT INFO:</div>
      <div className="flex mt-4">
        <div className="h-68 w-68 rounded shadow-lg object-cover">
          <NFTMedia contentType="image" source={file} />
        </div>
        <div className="ml-3.5 w-55.5 flex flex-col justify-between">
          <InputField
            label="NFT Title"
            required={true}
            name="title"
            value={nftDetail.title}
            setValue={(e) => handleNftContentChange(e, currentNftIdx)}
          />
          <InputField
            label="Description"
            required={true}
            type="textarea"
            name="description"
            value={nftDetail.description}
            setValue={(e) => handleNftContentChange(e, currentNftIdx)}
          />
          <div>
            <label
              htmlFor="tags"
              className="w-full uppercase text-lightBlue text-2xs leading-3 mb-1"
            >
              Tags
            </label>
            <input
              className="w-full bg-trueGray-100 bg-opacity-10 border-b border-white h-5.25 text-white px-1"
              name="tags"
              placeholder="Tags,"
              id="tags"
              value={tagInputs[currentNftIdx] ? tagInputs[currentNftIdx] : ''}
              onChange={(e) => {
                const updatedTagInputs = [...tagInputs]
                updatedTagInputs[currentNftIdx] = e.target.value
                setTagInputs(updatedTagInputs)
              }}
              onKeyUp={(e) => handleTagsKeyUp(e, currentNftIdx)}
            />
            <div className="text-warning mt-1 uppercase text-3xs">
              Separate with a “,” and hit space bar
            </div>

            <div className="max-h-9 w-full flex flex-wrap gap-1 overflow-y-scroll mt-1.5">
              {nftDetail.tags.map((tag) => (
                <div
                  onClick={() => removeTag(tag, currentNftIdx)}
                  key={tag}
                  className="max-h-3.75 flex justify-evenly items-center rounded-full bg-lightBlue text-2xs py-0.5 px-1.5 cursor-pointer"
                >
                  <CrossIcon className="mr-0.5 w-1.75 h-1.75" />
                  {formatLongString(tag, 25)}
                </div>
              ))}
            </div>
          </div>

          <div className="flex cursor-pointer">
            <input
              className="rounded-sm border border-white w-3.75 h-3.75"
              name="isNSFW"
              type="checkbox"
              id="nsfw"
              checked={nftDetail.isNSFW}
              onChange={(e) => handleNftContentChange(e, currentNftIdx)}
            ></input>
            <label style={{cursor:'pointer'}} for="nsfw" className="text-white ml-2 text-11px select-none">
              This content is <span className="text-warning">Explicit or 18+.</span>
            </label>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditNftInfo
