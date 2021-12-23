import React from 'react'

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

const fileNames = [
  'TATUAJE DE FUTBOL',
  'TATUAJE DE FUTBOL',
  'TATUAJE DE FUTBOL',
  'upYNfnwU1Y0ezUiIkr03lvLonglonglonglonglong stringLv',
  'TATUAJE DE FUTBOLTATUAJE DE FUTBOLTATUAJE DE FUTBOLTATUAJE DE FUTBOL',
  'upYNfnwU1Y0ezUiIkr03lvLonglonglonglonglong stringLv',
  'upYNfnwU1Y0ezUiIkr03lvLonglonglonglonglong stringLv',
  'upYNfnwU1Y0ezUiIkr03lvLonglonglonglonglong stringLv',
  'upYNfnwU1Y0ezUiIkr03lvLonglonglonglonglong stringLv',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)',
  'CueCard #11-Twitter (2)'
]

const BatchUploadModal = () => {
  return (
    <div className="fixed top-0 left-0 z-51 w-screen h-screen flex items-center justify-center">
      <div className="w-221.5 h-116.75 bg-blue-800 rounded shadow-md pt-3 px-4 relative">
        <div className="w-full flex justify-between">
          <BackIcon className="w-9 h-9 cursor-pointer" />
          <CloseIcon className="w-9 h-9 cursor-pointer" />
        </div>
        <div className="flex w-full mt-4 items-center justify-between">
          <NextButton className="w-3.75 h-6.75 cursor-pointer" />
          <div className="flex">
            <div className="w-66.75">
              <div className="text-xl text-white">UPLOADED FILES</div>
              <div className="list-disc overflow-y-scroll overflow-x-none h-68 mt-4 pl-4 pr-1.5">
                {fileNames.map((fileName, idx) => (
                  <div
                    className="my-0.5 bg-trueGray-300 bg-opacity-20 h-8 flex text-white items-center justify-between font-light text-xs tracking-finnieSpacing-wide pr-2.75"
                    key={idx}
                  >
                    {formatLongString(fileName, 25)}
                    <RemoveNFTIcon className="w-2.75 h-2.75 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
            <div className="ml-5.5">
              <div className="text-xl text-white">EDIT NFT INFO:</div>
              <div className="flex mt-4">
                <div className="h-68 w-68 rounded shadow-lg object-cover">
                  <NFTMedia
                    contentType="image"
                    source="https://arweave.net/pCPt4Yf5XTztJuOwvQBxsr8a7skvYa-gtwYF9YdYacc"
                  />
                </div>
                <div className="ml-3.5 w-55.5 flex flex-col justify-between">
                  <InputField label="NFT Title" required={true} />
                  <InputField label="Description" required={true} type="textarea" />
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
                    />
                    <div className="text-warning mt-1 uppercase text-3xs">
                      Separate with a “,” and hit space bar
                    </div>

                    <div className="max-h-9 w-full flex flex-wrap gap-1 overflow-y-scroll mt-1.5">
                      {['tag21', 'tags afdasf', 'new ta2', 'tag22', 'tags afdasf', 'new tag'].map(
                        (tag) => (
                          <div
                            onClick={() => removeTag(tag)}
                            key={tag}
                            className="max-h-3.75 flex justify-evenly items-center rounded-full bg-lightBlue text-2xs py-0.5 px-1.5 cursor-pointer"
                          >
                            <CrossIcon className="mr-0.5 w-1.75 h-1.75" />
                            {formatLongString(tag, 25)}
                          </div>
                        )
                      )}
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
          <PreviousButton className="w-3.75 h-6.75 cursor-pointer" />
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
