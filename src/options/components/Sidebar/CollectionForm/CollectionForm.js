import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import AddIcon from 'img/v2/create-collection-form/add-icon.svg'
import CrossIcon from 'img/v2/cross-icon.svg'
import PhotoIcon from 'img/v2/photo-icon.svg'
import capitalize from 'lodash/capitalize'
import find from 'lodash/find'
import get from 'lodash/get'
import initial from 'lodash/initial'
import isEmpty from 'lodash/isEmpty'
import union from 'lodash/union'
import { setError } from 'options/actions/error'
import { setSelectedNftIds } from 'options/actions/selectedNftIds'
import BatchUploadModal from 'options/components/BatchUploadModal'
import Button from 'options/components/Button'
import CheckBox from 'options/components/CheckBox'
import DropFile from 'options/components/DropFile'
import InputField from 'options/components/InputField'
import getCollectionByTxId from 'options/selectors/getCollectionByTxid'
import formatLongString from 'options/utils/formatLongString'
import { popupAccount } from 'services/account'
import arweave from 'services/arweave'
import createOrUpdateCollection from 'utils/collectionHelper'

import ConfirmModal from './ConfirmModal'

import './CollectionForm.css'

const CollectionForm = ({ isUpdate }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const collectionId = useSelector((state) => state.editingCollectionId)

  const collection = useSelector(getCollectionByTxId(collectionId))
  const address = useSelector((state) => state.defaultAccount.AR?.address)
  const _nfts = useSelector((state) => state.assets.nfts)
  const collectionNfts = useSelector((state) => state.assets.collectionNfts)
  const selectedNftIds = useSelector((state) => state.selectedNftIds)

  const selectFiles = useRef(null)
  const titleField = useRef(null)

  const [collectionInfo, setCollectionInfo] = useState({
    title: '',
    owner: '',
    description: '',
    isNSFW: false,
    tags: [],
    name: ''
  })

  const [errors, setErrors] = useState({
    title: '',
    owner: '',
    description: '',
    files: ''
  })

  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [files, setFiles] = useState([])
  const [showBatchUploadModal, setShowBatchUploadModal] = useState(false)
  const [showingConfirmModal, setShowingConfirmModal] = useState(false)
  const [nfts, setNfts] = useState([])

  const filesSize = useMemo(() => {
    return files.reduce((sum, f) => {
      let size = sum + f.size
      return size
    }, 0)
  }, [files])

  const resetState = () => {
    setCollectionInfo({
      title: '',
      owner: '',
      description: '',
      isNSFW: false,
      tags: [],
      name: ''
    })
    setErrors({
      title: '',
      owner: '',
      description: '',
      files: ''
    })
    setTagInput('')
    setTags([])
    setFiles([])
    setShowBatchUploadModal(false)
    setNfts([])
  }

  const handleCollectionContentChange = (e) => {
    setErrors({
      title: '',
      owner: '',
      description: '',
      files: ''
    })
    setCollectionInfo({ ...collectionInfo, [e.target.name]: e.target.value })
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
    const keys = ['title', 'description']
    let isValid = true

    for (const key of keys) {
      if (isEmpty(collectionInfo[key])) {
        isValid = false
        setErrors((prev) => ({ ...prev, [key]: `${capitalize(key)} cannot be empty` }))
      }
    }

    if (isEmpty(files) && isEmpty(selectedNftIds)) {
      isValid = false
      setErrors((prev) => ({ ...prev, files: 'Please select a file or select an nft' }))
    }

    return isValid
  }

  const openBatchModal = () => {
    if (validateForm()) {
      setShowBatchUploadModal(true)
    } else {
      titleField.current.scrollIntoView()
    }
  }

  const handleConfirmCollection = async () => {
    try {
      let arPrice = (await arweave.transactions.getPrice(filesSize)) + 0.00004
      arPrice = arweave.ar.winstonToAr(arPrice)
      const koiPrice = nfts.length

      const account = await popupAccount.getAccount({ address })
      const arBalance = await account.get.balance()
      const koiBalance = await account.get.koiBalance()

      if (koiPrice > koiBalance) throw new Error('Not enough KOII')
      if (arPrice > arBalance) throw new Error('Not enough AR')

      const tempData = {
        ...collectionInfo,
        name: collectionInfo.title,
        previewImageIndex: 0,
        owner: address
      }

      delete tempData.isNSFW
      await createOrUpdateCollection({
        nfts,
        setNfts,
        address,
        collectionData: tempData,
        selectedNftIds,
        collectionId: isUpdate ? collectionId : null
      })

      dispatch(setSelectedNftIds([]))
    } catch (err) {
      console.error(err.message)
      dispatch(setError(err.message))
      setShowingConfirmModal(false)
    }
  }

  const closeCreateModal = () => {
    setShowBatchUploadModal(false)
  }

  const handleReselectFiles = () => {
    selectFiles.current.click()
  }

  const getFilesFromFileList = (e) => {
    const _files = []
    for (let i = 0; i < e.target.files.length; i++) {
      _files.push(e.target.files.item(i))
    }

    return _files
  }

  const showConfirmModal = () => {
    setShowingConfirmModal(true)
  }

  const closeConfirmModal = () => {
    setShowingConfirmModal(false)
  }

  const confirmModalGoback = () => {
    setShowingConfirmModal(false)
    setShowBatchUploadModal(true)
  }

  const openSelectNftModal = () => {
    history.push('/collections/create/select-nft')
  }

  /* Load collection data */
  useEffect(() => {
    if (isUpdate) {
      if (!isEmpty(collection)) {
        const name = get(collection, 'name')
        const description = get(collection, 'description')
        const tags = get(collection, 'tags') || []

        const newCollectionInfo = {
          ...collectionInfo,
          title: name,
          description,
          tags
        }

        setTags(tags)

        setCollectionInfo(newCollectionInfo)
      }
    }
  }, [collection])

  useEffect(() => {
    return () => {
      dispatch(setSelectedNftIds([]))
    }
  }, [])

  useEffect(() => {
    setErrors({
      title: '',
      owner: '',
      description: '',
      files: ''
    })
  }, [selectedNftIds])

  const label = {
    title: isUpdate
      ? chrome.i18n.getMessage('CollectionLabelEditTitle')
      : chrome.i18n.getMessage('CollectionLabelTitle'),
    description: isUpdate
      ? chrome.i18n.getMessage('CollectionLabelEditDescription')
      : chrome.i18n.getMessage('Description'),
    tags: chrome.i18n.getMessage('tagsLowerCase')
  }

  return (
    <>
      <div className="flex flex-col px-4 pt-4 pb-8">
        <input
          type="file"
          multiple
          style={{ display: 'none' }}
          ref={selectFiles}
          onChange={(e) => setFiles(getFilesFromFileList(e))}
        />
        <div ref={titleField}>
          <InputField
            className="my-1"
            label={label.title}
            value={collectionInfo.title}
            setValue={handleCollectionContentChange}
            required={true}
            name="title"
            error={errors.title}
            placeholder={chrome.i18n.getMessage('CollectionPlaceHolderTitle')}
          />
        </div>
        <InputField
          className="my-1"
          label={label.description}
          value={collectionInfo.description}
          setValue={handleCollectionContentChange}
          required={true}
          type="textarea"
          name="description"
          error={errors.description}
          placeholder={chrome.i18n.getMessage('CollectionPlaceHolderDescription')}
          maxHeight={200}
        />
        <div className="my-1 flex flex-col w-full">
          <label htmlFor="tags" className="w-full uppercase text-lightBlue text-2xs leading-3 mb-1">
            {label.tags}
          </label>
          <input
            className="w-full bg-trueGray-100 bg-opacity-10 border-b border-white h-5.25 text-white px-1 create-collection-tag-input"
            name="tags"
            placeholder={chrome.i18n.getMessage('CollectionPlaceHolderTags')}
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyUp={(e) => handleTagsKeyUp(e)}
          />
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
          <CheckBox
            checked={collectionInfo.isNSFW}
            onClick={() => setCollectionInfo((prev) => ({ ...prev, isNSFW: !prev.isNSFW }))}
            theme="dark"
            className="w-3.75 h-3.75"
          />
          <div
            className="text-white ml-2 text-11px select-none"
            onClick={() => setCollectionInfo((prev) => ({ ...prev, isNSFW: !prev.isNSFW }))}
          >
            This content is <span className="text-warning">Explicit or 18+.</span>
          </div>
        </div>
        <div className="w-50 h-36.25 border border-dashed border-success rounded">
          {isEmpty(files) && isEmpty(selectedNftIds) ? (
            <DropFile
              files={files}
              setFiles={setFiles}
              fileType={['image/*', 'video/*', 'audio/*']}
              className="w-full h-full"
              description={chrome.i18n.getMessage('SelectMultipleFiles')}
              isCreateCollection={true}
            />
          ) : (
            <div onClick={handleReselectFiles}>
              <ul
                style={{
                  listStyleType: 'circle',
                  color: 'white',
                  fontSize: '10px',
                  padding: '10px',
                  paddingLeft: '20px',
                  height: '145px',
                  overflowY: 'overlay',
                  cursor: 'pointer'
                }}
              >
                {files.map((file, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    {file.name}
                  </li>
                ))}
                {selectedNftIds.map((id, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    <div className="flex w-full justify-between">
                      <div className="w-28 truncate">
                        {find(_nfts, (nft) => nft.txId === id)?.name ||
                          find(collectionNfts, (nft) => nft.txId === id)?.name ||
                          id}
                      </div>
                      <div>
                        <PhotoIcon />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <span className="text-3xs text-bittersweet-200 mb-4.25">{errors.files}</span>
        {!isUpdate && (
          <div
            onClick={openSelectNftModal}
            className="flex text-xs text-success w-full mb-3.5 cursor-pointer"
          >
            <div className="w-4.5 h-4.5 mr-1.5">
              <AddIcon />
            </div>
            Add from my existing NFTs
          </div>
        )}
        <Button
          onClick={openBatchModal}
          variant="light"
          text={chrome.i18n.getMessage('AddNFTDetails')}
          className="text-sm"
        />
      </div>
      {showBatchUploadModal && (
        <BatchUploadModal
          nfts={nfts}
          setNfts={setNfts}
          close={closeCreateModal}
          inputFiles={files}
          showConfirmModal={showConfirmModal}
        />
      )}
      {showingConfirmModal && (
        <ConfirmModal
          numOfNfts={nfts.length}
          filesSize={filesSize}
          close={closeConfirmModal}
          handleConfirmCollection={handleConfirmCollection}
          goBack={confirmModalGoback}
          nfts={nfts}
          resetState={resetState}
          isUpdate={isUpdate}
        />
      )}
    </>
  )
}

export default CollectionForm
