import clsx from 'clsx'
import React from 'react'

import RemoveNFTIcon from 'img/v2/cross-icon-orange.svg'

import formatLongString from 'finnie-v2/utils/formatLongString'

const UploadedFiles = ({ files, currentNftIdx, setCurrentNftIdx, removeNft, error }) => {
  return (
    <>
      <div className="text-xl text-white">UPLOADED FILES</div>
      <div className="list-disc overflow-y-scroll overflow-x-none h-68 mt-4 pl-4 pr-1.5">
        {files.map(({ name }, idx) => (
          <div
            className={clsx(
              currentNftIdx === idx && 'bg-trueGray-300 bg-opacity-20',
              !(error[idx].title === '' && error[idx].description === '') &&
                'bg-red-finnie bg-opacity-20',
              'my-0.5 pl-1 cursor-pointer h-8 flex text-white items-center justify-between font-light text-xs tracking-finnieSpacing-wide pr-2.75'
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
