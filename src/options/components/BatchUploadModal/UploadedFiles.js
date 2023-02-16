import React from 'react'
import clsx from 'clsx'
import RemoveNFTIcon from 'img/v2/cross-icon-orange.svg'
import PhotoIcon from 'img/v2/photo-icon.svg'
import formatLongString from 'options/utils/formatLongString'

const UploadedFiles = ({ files, currentNftIdx, setCurrentNftIdx, removeNft, error, selectNft }) => {
  return (
    <>
      <div className="text-xl text-white">{chrome.i18n.getMessage('UploadedFiles')}</div>
      <div className="list-disc overflow-y-scroll overflow-x-none h-68 mt-4 pl-4 pr-1.5">
        {files.map(({ name, info: { existingNft } }, idx) => (
          <div
            className={clsx(
              currentNftIdx === idx && 'bg-trueGray-300 bg-opacity-20',
              !(error[idx]?.title === '' && error[idx]?.description === '') &&
                'bg-red-finnie bg-opacity-20',
              'my-0.5 pl-1 cursor-pointer h-8 flex text-white items-center justify-between text-xs tracking-finnieSpacing-wide pr-2.75'
            )}
            key={idx}
          >
            <span onClick={() => selectNft(idx)} className="h-full flex-grow flex items-center">
              {formatLongString(name, 25)}
            </span>
            {existingNft && <div className='mr-2'><PhotoIcon /></div>}
            <RemoveNFTIcon
              onClick={() => {
                // TODO - close modal when there is no item

                if (currentNftIdx === files.length - 1) {
                  setCurrentNftIdx((prev) => prev - 1)
                }

                if (idx < currentNftIdx) {
                  setCurrentNftIdx((prev) => prev - 1)
                }

                removeNft(idx)
              }}
              className="w-2.75 h-2.75 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default UploadedFiles
