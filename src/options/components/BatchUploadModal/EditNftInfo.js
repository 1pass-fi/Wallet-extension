import React, { useState } from 'react'
import { useEffect } from 'react'
import clsx from 'clsx'
import CrossIcon from 'img/v2/cross-icon.svg'
import initial from 'lodash/initial'
import union from 'lodash/union'
import CheckBox from 'options/components/CheckBox'
import InputField from 'options/components/InputField'
import NFTMedia from 'options/components/NFTMedia'
import formatLongString from 'options/utils/formatLongString'

const EditNftInfo = ({
  currentNftIdx,
  nftInfo,
  file,
  updateNftInfo,
  tagInputs,
  setTagInputs,
  error,
  setError
}) => {
  const [nftDetail, setNftDetail] = useState(nftInfo)

  useEffect(() => {
    setNftDetail(nftInfo)
  }, [nftInfo])

  const handleNftContentChange = (e, idx) => {
    let updatedNftDetail = { ...nftDetail }

    if (e.target.name === 'title' || e.target.name === 'description') {
      let newError = [...error]
      newError[currentNftIdx][e.target.name] = ''
      setError(newError)
    }

    updatedNftDetail = { ...updatedNftDetail, [e.target.name]: e.target.value }

    setNftDetail(updatedNftDetail)
    updateNftInfo(idx, updatedNftDetail)
  }

  const handleNftContentNSFTChange = (idx) => {
    const updatedNftDetail = { ...nftDetail, isNSFW: !nftDetail.isNSFW }
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
      <div className="text-xl text-white">{chrome.i18n.getMessage('EditNFTInfo')}</div>
      <div className="flex mt-4">
        <div className="h-68 w-68 rounded shadow-lg object-cover">
          <NFTMedia contentType={nftInfo.contentType} source={file} />
        </div>
        <div className="ml-3.5 w-55.5 flex flex-col justify-between">
          <InputField
            label={chrome.i18n.getMessage('NFTTitleLabel')}
            required={true}
            name="title"
            value={nftDetail.title}
            setValue={(e) => handleNftContentChange(e, currentNftIdx)}
            error={error[currentNftIdx]?.title}
            isDisable={nftInfo.existingNft}
          />
          <InputField
            label={chrome.i18n.getMessage('NFTDescriptionLabel')}
            required={true}
            type="textarea"
            name="description"
            value={nftDetail.description}
            setValue={(e) => handleNftContentChange(e, currentNftIdx)}
            error={error[currentNftIdx]?.description}
            isDisable={nftInfo.existingNft}
          />
          <div>
            <label
              htmlFor="tags"
              className="w-full uppercase text-lightBlue text-2xs leading-3 mb-1"
            >
              Tags
            </label>
            <input
              className="w-full bg-trueGray-100 bg-opacity-10 border-b border-white h-5.25 text-white px-1 input-field-component"
              name="tags"
              placeholder={chrome.i18n.getMessage('Tags')}
              id="tags"
              value={tagInputs[currentNftIdx] ? tagInputs[currentNftIdx] : ''}
              onChange={(e) => {
                const updatedTagInputs = [...tagInputs]
                updatedTagInputs[currentNftIdx] = e.target.value
                setTagInputs(updatedTagInputs)
              }}
              onKeyUp={(e) => handleTagsKeyUp(e, currentNftIdx)}
              disabled={nftInfo.existingNft}
            />
            <div className="text-warning mt-1 uppercase text-3xs">
              {chrome.i18n.getMessage('TagsPlaceHolder')}
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
            <CheckBox
              checked={nftDetail.isNSFW}
              onClick={() => handleNftContentNSFTChange(currentNftIdx)}
              disabled={nftInfo.existingNft}
              className="w-3.75 h-3.75"
              theme="dark"
            />

            <div
              className={clsx(
                'text-white ml-2 text-11px select-none cursor-pointer',
                nftInfo.existingNft && 'cursor-not-allowed'
              )}
              onClick={
                !nftInfo.existingNft ? () => handleNftContentNSFTChange(currentNftIdx) : () => {}
              }
            >
              {chrome.i18n.getMessage('ThisContentIs')}
              <span className="text-warning">{chrome.i18n.getMessage('ExplicitMsg')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditNftInfo
