import React, { useState } from 'react'

import BackIcon from 'img/v2/back-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-blue.svg'
import ModalBackground from 'img/v2/modal-background.svg'

import Button from 'finnie-v2/components/Button'

const ConfirmModal = () => {
  const [step, setStep] = useState(1)

  return (
    <div className="fixed top-0 left-0 bg-black bg-opacity-25 z-50 w-full h-full flex items-center justify-center">
      <div className="relative w-146.5 h-83 bg-trueGray-100 rounded text-indigo">
        <div className="h-16.75 px-4 shadow-md flex items-center justify-between">
          <BackIcon className="w-7 cursor-pointer" />
          <span className="font-semibold text-xl">Confirm Your Collection</span>
          <CloseIcon className="w-7 cursor-pointer" />
        </div>
        {step === 1 && (
          <section className="py-5 text-center text-base px-16.5">
            <>
              <p className="mb-5.5">
                An Atomic NFT is store permanently on Arweave and earns attention rewards forever
                through Koi.
              </p>
              <div className="flex justify-around text-left">
                <div>
                  <div className="font-semibold tracking-finnieSpacing-wide">
                    Files to be minted:
                  </div>
                  <div>25 pieces</div>
                  <div className="font-semibold tracking-finnieSpacing-wide">Size: 356 MB</div>
                </div>
                <div>
                  <div className="font-semibold tracking-finnieSpacing-wide">Estimated Costs:</div>
                  <div>953.121 KOII</div>
                  <div>10.463 AR</div>
                  <div className="text-2xs tracking-finnieSpacing-wider text-success-700">
                    Storage Fee
                  </div>
                </div>
              </div>
              <div className="absolute bottom-5.5 w-full flex left-0 justify-center">
                <Button
                  variant="indigo"
                  text="Create Collection"
                  className="font-semibold tracking-wider py-3 rounded"
                  onClick={() => setStep(2)}
                />
              </div>
            </>
          </section>
        )}
        {step === 2 && (
          <section className="">
            <ModalBackground className="absolute top-16.75 left-0" />
            <div className="absolute left-57.75 top-43.75">
              <div className="font-semibold text-xl tracking-finnieSpacing-wide">
                Your edits have been saved!
              </div>
            </div>
            <div className="absolute bottom-5.5 w-full flex left-0 justify-center">
              <Button
                variant="indigo"
                text="OK"
                className="w-43.75 font-semibold tracking-wider py-3 rounded"
                onClick={() => setStep(2)}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ConfirmModal
