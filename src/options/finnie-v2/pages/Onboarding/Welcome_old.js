import React from 'react'
import clsx from 'clsx'

import WelcomeBackgroundTop from 'img/v2/popup/welcome-background-top.svg'
import WelcomeBackgroundBottom from 'img/v2/popup/welcome-background-bottom.svg'
import CreateNewIcon from 'img/v2/popup/create-new-icon.svg'
import ImportSeedphraseIcon from 'img/v2/popup/import-seedphrase-icon.svg'
import ImportKeyIcon from 'img/v2/popup/import-key-icon.svg'
import KoiIcon from 'img/finnie-koi-logo-white.svg'

const Welcome = () => {
  return (
    <div className="w-screen h-screen flex text-center">
      <div className="w-2/5 h-full bg-blue-800 shadow-lg grid grid-cols-1 grid-rows-7 justify-items-center">
        <KoiIcon className="row-span-2 self-end" style={{ width: '210px', height: '210px' }} />
        <div
          className="w-4/5 row-span-1 font-semibold tracking-finnieSpacing-wider text-white"
          style={{ fontSize: '35px', lineHeight: '41px' }}
        >
          Welcome to the Finnie Wallet
        </div>
        <div className="row-span-1 font-normal text-3xl leading-4  text-success">
          Let’s get started.
        </div>
        <div className="w-4/5 row-span-3 font-normal text-lg leading-6 text-white">
          To use the Finnie Wallet, add a key. This can be one you already have or you can make a
          new one.
        </div>
      </div>
      <div
        className={clsx(
          'w-3/5 h-full relative bg-gradient-to-r from-blue-300 to-indigo shadow-lg',
          'flex flex-col items-center justify-evenly text-white overflow-hidden'
        )}
      >
        <WelcomeBackgroundTop className="absolute top-0 right-0" />
        <WelcomeBackgroundBottom className="absolute bottom-0 left-0" />
        <div
          className="bg-blue-800 shadow-md rounded-finnie z-10 flex flex-col items-center justify-center cursor-pointer"
          style={{ width: '249px', height: '140px' }}
        >
          <CreateNewIcon style={{ width: '32px', height: '32px' }} />
          <div className="mt-3 font-semibold text-base leading-4 text-center text-white">
            Get a new key
          </div>
          <div className="mt-2 font-normal text-xs text-center tracking-finnieSpacing-wide text-white">
            Start from the beginning.
          </div>
        </div>
        <div
          className="bg-blue-800 shadow-md rounded-finnie z-10 flex flex-col items-center justify-center cursor-pointer"
          style={{ width: '249px', height: '140px' }}
        >
          <ImportSeedphraseIcon style={{ width: '32px', height: '28px' }} />
          <div className="mt-3 font-semibold text-base leading-4 text-center text-white">
            Import with a seed phrase
          </div>
          <div className="mt-2 font-normal text-xs text-center tracking-finnieSpacing-wide text-white w-9/12">
            Import an existing key using a 12-word recovery phrase.
          </div>
        </div>
        <div
          className="bg-blue-800 shadow-md rounded-finnie z-10 flex flex-col items-center justify-center cursor-pointer"
          style={{ width: '249px', height: '140px' }}
        >
          <ImportKeyIcon style={{ width: '32px', height: '28px' }} />
          <div className="mt-3 font-semibold text-base leading-4 text-center text-white">
            Import a private key
          </div>
          <div className="mt-2 font-normal text-xs text-center tracking-finnieSpacing-wide text-white w-8/12">
            Import an existing key by uploading a .JSON file.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
