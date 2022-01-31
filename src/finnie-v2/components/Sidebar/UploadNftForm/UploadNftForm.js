import React, { useEffect, useMemo, useState } from 'react'
import capitalize from 'lodash/capitalize'
import isEmpty from 'lodash/isEmpty'
import initial from 'lodash/initial'
import union from 'lodash/union'

import CrossIcon from 'img/v2/cross-icon.svg'

import InputField from 'finnie-v2/components/InputField'
import Button from 'finnie-v2/components/Button'
import ConfirmCreateNftModal from 'finnie-v2/components/ConfirmCreateNftModal'
import DropFile from 'finnie-v2/components/DropFile'
import NFTMedia from 'finnie-v2/components/NFTMedia'

import formatLongString from 'finnie-v2/utils/formatLongString'
import { getFileType } from 'finnie-v2/utils/getFileType'

const UploadNftForm = () => {
  const [nftContent, setNftContent] = useState({
    title: '',
    owner: '',
    description: '',
    isNSFW: false
  })

  const [errors, setErrors] = useState({
    title: '',
    owner: '',
    description: '',
    file: ''
  })

  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [file, setFile] = useState({})
  const [showConfirmModal, setShowConfirmModal] = useState(false)

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
    if (!isEmpty(file)) {
      setErrors((prev) => ({ ...prev, file: '' }))
    }
  }, [file])

  const handleNftContentChange = (e) => {
    setErrors({
      title: '',
      owner: '',
      description: '',
      file: ''
    })
    setNftContent({ ...nftContent, [e.target.name]: e.target.value })
  }

  const handleTagsKeyUp = (e) => {
    if (e.key === ' ' && tagInput.endsWith(', ')) {
      const newTags = initial(tagInput.split(','))
      setTags(union(tags, newTags))
      setTagInput('')
    }
  }

  const removeTag = (removeTag) => {
    setTags(tags.filter((tag) => tag !== removeTag))
  }

  const validateForm = () => {
    const keys = ['title', 'description', 'owner']
    let isValid = true

    for (const key of keys) {
      if (isEmpty(nftContent[key])) {
        isValid = false
        setErrors((prev) => ({ ...prev, [key]: `${capitalize(key)} cannot be empty` }))
      }
    }

    if (isEmpty(file)) {
      isValid = false
      setErrors((prev) => ({ ...prev, file: 'Please select a file' }))
    }

    return isValid
  }

  const handleCreateNFT = () => {
    if (validateForm()) {
      setShowConfirmModal(true)
    }
  }

  const closeConfirmModal = () => {
    setShowConfirmModal(false)
    setNftContent({ title: '', owner: '', description: '', isNSFW: false })
    setTagInput('')
    setTags([])
    setFile({})
  }

  return (
    <>
      <div className="flex flex-col px-4 pt-4 pb-8">
        <InputField
          className="my-1"
          label="NFT Title"
          value={nftContent.title}
          setValue={handleNftContentChange}
          required={true}
          name="title"
          error={errors.title}
        />
        <InputField
          className="my-1"
          label="Username"
          value={nftContent.owner}
          setValue={handleNftContentChange}
          required={true}
          name="owner"
          error={errors.owner}
        />
        <InputField
          className="my-1"
          label="Description"
          value={nftContent.description}
          setValue={handleNftContentChange}
          required={true}
          type="textarea"
          name="description"
          error={errors.description}
        />
        <div className="my-1 flex flex-col w-full">
          <label htmlFor="tags" className="w-full uppercase text-lightBlue text-2xs leading-3 mb-1">
            Tags
          </label>
          <input
            className="w-full bg-trueGray-100 bg-opacity-10 border-b border-white h-5.25 text-white  px-1"
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
        {isEmpty(file) ? (
          <div className="w-50 h-36.25 border border-dashed border-success rounded">
            <DropFile
              file={file}
              setFile={setFile}
              fileType={['image/*', 'video/*', 'audio/*']}
              className="w-full h-full"
              description="Click to upload an Atomic NFT"
            />
          </div>
        ) : (
          <div className="w-50 relative object-cover">
            <CrossIcon
              onClick={() => setFile({})}
              className="z-50 absolute top-2 right-2 w-4 h-4 cursor-pointer bg-white bg-opacity-60 rounded-full p-1 shadow-lg"
            />
            <NFTMedia contentType={fileType} source={url} />
          </div>
        )}
        <span className="text-3xs text-bittersweet-200 mb-4.25">{errors.file}</span>

        <Button
          onClick={handleCreateNFT}
          variant="light"
          text="Create NFT"
          className="text-sm"
        />
      </div>
      {showConfirmModal && (
        <ConfirmCreateNftModal
          nftContent={nftContent}
          tags={tags}
          fileType={fileType}
          url={url}
          close={closeConfirmModal}
        />
      )}
    </>
  )
}

export default UploadNftForm
