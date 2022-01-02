import React, { useState, useEffect } from 'react'

import sendMessage from 'finnie-v2/utils/sendMessage'

import BackIcon from 'img/v2/back-icon.svg'
import CheckMarkIcon from 'img/v2/check-mark-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-white.svg'
import NextButton from 'img/v2/arrow-right-orange.svg'
import PreviousButton from 'img/v2/arrow-left-orange.svg'

import Button from 'finnie-v2/components/Button'
import UploadedFiles from './UploadedFiles'
import EditNftInfo from './EditNftInfo'

const BatchUploadModal = ({ close, inputFiles, showConfirmModal, nfts, setNfts }) => {
  const [currentNftIdx, setCurrentNftIdx] = useState(0)
  const [updateAll, setUpdateAll] = useState(false)
  const [error, setError] = useState(inputFiles.map(() => ({ title: '', description: '' })))

  useEffect(() => {
    const nfts = inputFiles.map((f, index) => {
      const url = URL.createObjectURL(f)
      return {
        info: {
          isNSFW: false,
          ownerName: '',
          ownerAddress: '',
          title: f.name.split('.').slice(0, -1).join('.'),
          description: '',
          tags: [],
          contentType: f.type,
          createdAt: Date.now()
        },
        uploaded: false,
        file: url,
        name: f.name,
        url
      }
    })

    setNfts(nfts)
  }, [])

  const [tagInputs, setTagInputs] = useState([])

  const updateNftInfo = (idx, info) => {
    let updatedNfts = [...nfts]

    if (!updateAll) {
      updatedNfts[idx] = { ...updatedNfts[idx], info }
      setNfts(updatedNfts)
    } else {
      updatedNfts = updatedNfts.map((nft) => {
        const title = nft.info.title
        return { ...nft, info: { ...info, title } }
      })
    }

    setNfts(updatedNfts)
  }

  const removeNft = (idx) => {
    const newNfts = [...nfts]
    const newError = [...error]
    newError.splice(idx, 1)
    setError(newError)
    newNfts.splice(idx, 1)
    setNfts(newNfts)

    const newTagInputs = [...tagInputs]
    newTagInputs.splice(idx, 1)
    setTagInputs(newTagInputs)
  }

  const handleUpdateAll = (e) => {
    setUpdateAll(e.target.checked)
    let _nfts = [...nfts]
    _nfts = _nfts.map((nft) => {
      const title = nft.info.title
      nft.info = { ..._nfts[currentNftIdx].info, title }
      return nft
    })
    setNfts(_nfts)
  }

  const nftsValidate = () => {
    try {
      let validated = true

      let hadError = false

      let newError = [...error]

      for (const index in nfts) {
        const nft = nfts[index]
        if (!nft.info.title) {
          if (!hadError) setCurrentNftIdx(index); hadError = true
          validated = false
          newError[index].title = 'Title cannot be empty'
        }

        if (!nft.info.description) {
          if (!hadError) setCurrentNftIdx(index); hadError = true
          validated = false
          newError[index].description = 'Description cannot be empty'
        }
      }

      setError(newError)

      return validated
    } catch (err) {
      console.error(err.message)
    }
  }

  const handleSaveChangesClick = () => {
    if (!nftsValidate()) return
    close()
    showConfirmModal()
  }

  return (
    <div className="fixed top-0 left-0 z-51 w-screen h-screen flex items-center justify-center">
      <div className="w-221.5 h-116.75 bg-blue-800 rounded shadow-md pt-3 px-4 relative select-none">
        <div className="w-full flex justify-between">
          <BackIcon className="w-9 h-9 cursor-pointer" />
          <div onClick={close}>
            <CloseIcon className="w-9 h-9 cursor-pointer" />
          </div>
        </div>
        <div className="flex w-full mt-4 items-center justify-between">
          <div className="w-3.75">
            {currentNftIdx !== 0 && (
              <PreviousButton
                onClick={() => setCurrentNftIdx((prev) => prev - 1)}
                className=" h-6.75 cursor-pointer"
              />
            )}
          </div>
          <div className="flex">
            <div className="w-66.75">
              <UploadedFiles
                error={error}
                files={nfts}
                currentNftIdx={currentNftIdx}
                setCurrentNftIdx={setCurrentNftIdx}
                removeNft={removeNft}
              />
            </div>
            <div className="ml-5.5">
              <EditNftInfo
                error={error}
                setError={setError}
                currentNftIdx={currentNftIdx}
                nftInfo={nfts[currentNftIdx].info}
                file={nfts[currentNftIdx].file}
                updateNftInfo={updateNftInfo}
                tagInputs={tagInputs}
                setTagInputs={setTagInputs}
              />
            </div>
          </div>
          <div className="w-3.75">
            {currentNftIdx < nfts.length - 1 && (
              <NextButton
                onClick={() => setCurrentNftIdx((prev) => prev + 1)}
                className="h-6.75 cursor-pointer"
              />
            )}
          </div>
        </div>
        <Button
          text="Save Changes"
          className="mx-auto mt-6.5"
          variant="light"
          icon={CheckMarkIcon}
          size="lg"
          onClick={handleSaveChangesClick}
        />

        <div className="flex absolute cursor-pointer" style={{ left: '620px', bottom: '30px' }}>
          <input
            className="rounded-sm border border-success w-3.75 h-3.75"
            name="applyNfts"
            type="checkbox"
            onChange={handleUpdateAll}
            id="update-all"
          ></input>
          <label
            style={{ cursor: 'pointer' }}
            for="update-all"
            className="text-success ml-2 text-11px select-none w-55.5"
          >
            Apply these details (except the title) to all NFTs in this collection.
          </label>
        </div>
      </div>
    </div>
  )
}

export default BatchUploadModal
