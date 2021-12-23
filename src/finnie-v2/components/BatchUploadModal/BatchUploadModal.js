import React, { useState } from 'react'
import clsx from 'clsx'
import initial from 'lodash/initial'
import union from 'lodash/union'

import BackIcon from 'img/v2/back-icon.svg'
import CheckMarkIcon from 'img/v2/check-mark-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-white.svg'
import CrossIcon from 'img/v2/cross-icon.svg'
import RemoveNFTIcon from 'img/v2/cross-icon-orange.svg'
import NextButton from 'img/v2/arrow-right-orange.svg'
import PreviousButton from 'img/v2/arrow-left-orange.svg'

import Button from 'finnie-v2/components/Button'
import NFTMedia from 'finnie-v2/components/NFTMedia'
import InputField from 'finnie-v2/components/SideBar/InputField'
import formatLongString from 'finnie-v2/utils/formatLongString'

const BatchUploadModal = () => {
  const [currentNftIdx, setCurrentNftIdx] = useState(0)
  const [files, setFiles] = useState([
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 1',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      file:
        'https://duongma.com/wp-content/uploads/2019/12/christmas-background-space-greeting-text-noel-flat-lay-composition-fir-branches-red-berries-lying-light-127105018.jpg',
      name: 'Img 1'
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 2',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      file: 'https://seotrends.com.vn/wp-content/uploads/2021/07/anh-nen-noel-dep-1024x661.jpg',
      name: 'Img 2'
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 3',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      file: 'https://taimienphi.vn/tmp/cf/aut/background-giang-sinh-noel-dep-1.jpg',
      name: 'Img 3'
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 4',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      file:
        'https://mondaycareer.com/wp-content/uploads/2020/11/background-%C4%91%E1%BA%B9p-noel-3.jpg',
      name: 'Img 4'
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 1',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      file:
        'https://duongma.com/wp-content/uploads/2019/12/christmas-background-space-greeting-text-noel-flat-lay-composition-fir-branches-red-berries-lying-light-127105018.jpg',
      name: 'Img 5'
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 2',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      file: 'https://seotrends.com.vn/wp-content/uploads/2021/07/anh-nen-noel-dep-1024x661.jpg',
      name: 'Img 6'
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 3',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      file: 'https://taimienphi.vn/tmp/cf/aut/background-giang-sinh-noel-dep-1.jpg',
      name: 'Img 7'
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 4',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      file:
        'https://mondaycareer.com/wp-content/uploads/2020/11/background-%C4%91%E1%BA%B9p-noel-3.jpg',
      name: 'Img 8'
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 1',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      file:
        'https://duongma.com/wp-content/uploads/2019/12/christmas-background-space-greeting-text-noel-flat-lay-composition-fir-branches-red-berries-lying-light-127105018.jpg',
      name: 'Img 9'
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 2',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      file: 'https://seotrends.com.vn/wp-content/uploads/2021/07/anh-nen-noel-dep-1024x661.jpg',
      name: 'Img 10'
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 2',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      file: 'https://seotrends.com.vn/wp-content/uploads/2021/07/anh-nen-noel-dep-1024x661.jpg',
      name: 'Img 11'
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 2',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      file: 'https://seotrends.com.vn/wp-content/uploads/2021/07/anh-nen-noel-dep-1024x661.jpg',
      name: 'Img 12'
    }
  ])
  const [tagInput, setTagInput] = useState([])

  const handleNftContentChange = (e, idx) => {
    let updatedFiles = [...files]
    let info = updatedFiles[idx].info
    info = { ...info, [e.target.name]: e.target.value }
    updatedFiles[idx] = { ...updatedFiles[idx], info }
    setFiles(updatedFiles)
  }

  const handleTagsKeyUp = (e, idx) => {
    if (e.key === ' ' && tagInput[idx].endsWith(', ')) {
      let updatedFiles = [...files]
      let info = updatedFiles[idx].info

      const newTags = initial(tagInput[idx].split(','))
      info.tags = union(info.tags, newTags)

      info = { ...info, tags: info.tags }
      updatedFiles[idx] = { ...updatedFiles[idx], info }

      setFiles(updatedFiles)

      setTagInput({ ...tagInput, [idx]: '' })
    }
  }

  const removeTag = (removeTag, idx) => {
    let updatedFiles = [...files]
    let info = updatedFiles[idx].info
    info.tags = info.tags.filter((tag) => tag !== removeTag)


    info = { ...info, tags: info.tags }
    updatedFiles[idx] = { ...updatedFiles[idx], info }

    setFiles(updatedFiles)
  }

  return (
    <div className="fixed top-0 left-0 z-51 w-screen h-screen flex items-center justify-center">
      <div className="w-221.5 h-116.75 bg-blue-800 rounded shadow-md pt-3 px-4 relative select-none">
        <div className="w-full flex justify-between">
          <BackIcon className="w-9 h-9 cursor-pointer" />
          <CloseIcon className="w-9 h-9 cursor-pointer" />
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
              <div className="text-xl text-white">UPLOADED FILES</div>
              <div className="list-disc overflow-y-scroll overflow-x-none h-68 mt-4 pl-4 pr-1.5">
                {files.map(({ name }, idx) => (
                  <div
                    className={clsx(
                      currentNftIdx === idx && 'bg-trueGray-300 bg-opacity-20',
                      'my-0.5 cursor-pointer h-8 flex text-white items-center justify-between font-light text-xs tracking-finnieSpacing-wide pr-2.75'
                    )}
                    key={idx}
                  >
                    <span
                      onClick={() => setCurrentNftIdx(idx)}
                      className="h-full flex-grow flex items-center"
                    >
                      {formatLongString(name, 25)}
                    </span>
                    <RemoveNFTIcon
                      onClick={() => {
                        // TODO - close modal when there is no item

                        if (currentNftIdx === files.length - 1) {
                          setCurrentNftIdx((prev) => prev - 1)
                        }

                        if (idx < currentNftIdx) {
                          setCurrentNftIdx((prev) => prev - 1)
                        }

                        const newFiles = [...files]
                        newFiles.splice(idx, 1)
                        setFiles(newFiles)
                      }}
                      className="w-2.75 h-2.75 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="ml-5.5">
              <div className="text-xl text-white">EDIT NFT INFO:</div>
              <div className="flex mt-4">
                <div className="h-68 w-68 rounded shadow-lg object-cover">
                  <NFTMedia contentType="image" source={files[currentNftIdx].file} />
                </div>
                <div className="ml-3.5 w-55.5 flex flex-col justify-between">
                  <InputField
                    label="NFT Title"
                    required={true}
                    name="title"
                    value={files[currentNftIdx].info.title}
                    setValue={(e) => handleNftContentChange(e, currentNftIdx)}
                  />
                  <InputField
                    label="Description"
                    required={true}
                    type="textarea"
                    name="description"
                    value={files[currentNftIdx].info.description}
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
                      className="w-full bg-trueGray-100 bg-opacity-10 border-b border-white h-5.25 text-white"
                      name="tags"
                      placeholder="Tags,"
                      id="tags"
                      value={tagInput[currentNftIdx] ? tagInput[currentNftIdx] : ''}
                      onChange={(e) =>
                        setTagInput({ ...tagInput, [currentNftIdx]: e.target.value })
                      }
                      onKeyUp={(e) => handleTagsKeyUp(e, currentNftIdx)}
                    />
                    <div className="text-warning mt-1 uppercase text-3xs">
                      Separate with a “,” and hit space bar
                    </div>

                    <div className="max-h-9 w-full flex flex-wrap gap-1 overflow-y-scroll mt-1.5">
                      {files[currentNftIdx].info.tags.map((tag) => (
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
                    ></input>
                    <div className="text-white ml-2 text-11px select-none">
                      This content is <span className="text-warning">Explicit or 18+.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-3.75">
            {currentNftIdx < files.length - 1 && (
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
        />

        <div className="flex absolute cursor-pointer" style={{ left: '620px', bottom: '30px' }}>
          <input
            className="rounded-sm border border-success w-3.75 h-3.75"
            name="applyNfts"
            type="checkbox"
          ></input>
          <div className="text-success ml-2 text-11px select-none">Use this info for all NFTS</div>
        </div>
      </div>
    </div>
  )
}

export default BatchUploadModal
