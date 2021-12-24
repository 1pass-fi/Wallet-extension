import React, { useState } from 'react'

import BackIcon from 'img/v2/back-icon.svg'
import CheckMarkIcon from 'img/v2/check-mark-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-white.svg'
import NextButton from 'img/v2/arrow-right-orange.svg'
import PreviousButton from 'img/v2/arrow-left-orange.svg'

import Button from 'finnie-v2/components/Button'
import UploadedFiles from './UploadedFiles'
import EditNftInfo from './EditNftInfo'

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
  const [tagInputs, setTagInputs] = useState([])

  const updateNftInfo = (idx, info) => {
    let updatedFiles = [...files]
    updatedFiles[idx] = { ...updatedFiles[idx], info }
    setFiles(updatedFiles)
  }

  const removeNft = (idx) => {
    const newFiles = [...files]
    newFiles.splice(idx, 1)
    setFiles(newFiles)

    const newTagInputs = [...tagInputs]
    newTagInputs.splice(idx, 1)
    setTagInputs(newTagInputs)
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
              <UploadedFiles
                files={files}
                currentNftIdx={currentNftIdx}
                setCurrentNftIdx={setCurrentNftIdx}
                removeNft={removeNft}
              />
            </div>
            <div className="ml-5.5">
              <EditNftInfo
                currentNftIdx={currentNftIdx}
                nftInfo={files[currentNftIdx].info}
                file={files[currentNftIdx].file}
                updateNftInfo={updateNftInfo}
                tagInputs={tagInputs}
                setTagInputs={setTagInputs}
              />
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
