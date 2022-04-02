import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

import BackBtn from 'img/popup/back-button.svg'
import FinnieIcon from 'img/popup/finnie-icon-blue.svg'

import Search from './Search'
import CustomToken from './CustomToken'
import clsx from 'clsx'

const tabs = [
  { name: 'Search', to: 'SEARCH_TOKEN' },
  { name: 'Custom Token', to: 'CUSTOM_TOKEN' }
]

export const ImportToken = () => {
  const history = useHistory()

  const [currentTab, setCurrentTab] = useState('SEARCH_TOKEN')
  const [tokenImport, setTokenImport] = useState({})

  return (
    <div>
      <div
        className="bg-trueGray-100 shadow-md flex items-center"
        style={{ width: '426px', height: '48px' }}
      >
        <BackBtn
          onClick={() => history.goBack()}
          className="w-8.75 h-8.75 ml-3.75 cursor-pointer bg-white bg-opacity-70 rounded-full"
        />
        <div className="ml-6 font-semibold text-lg text-blue-800">Import a Token</div>
      </div>

      {isEmpty(tokenImport) ? (
        <>
          <div className="flex sticky font-normal text-base leading-5 text-blue-850">
            {tabs.map((tab, idx) => (
              <div
                key={idx}
                className={clsx(
                  'ml-18 h-10.75 flex items-center justify-center cursor-pointer',
                  currentTab === tab.to && 'text-blue-800 underline'
                )}
                onClick={() => setCurrentTab(tab.to)}
              >
                {tab.name}
              </div>
            ))}
          </div>
          {currentTab === 'SEARCH_TOKEN' && <Search setTokenImport={setTokenImport} />}
          {currentTab === 'CUSTOM_TOKEN' && <CustomToken />}
        </>
      ) : (
        <div className="mt-6.25 px-6 text-blue-800">
          <div className="font-normal text-base tracking-finnieSpacing-tight">
            To which wallet(s) do you want to import these tokens?
          </div>
          <div className="mt-6.25 text-xs font-normal tracking-finnieSpacing-wide">Token</div>
          <div className="flex items-center mt-3.75">
            <FinnieIcon style={{ width: '36px', height: '36px' }} />
            <div className="ml-3 font-normal text-base tracking-finnieSpacing-tight">
              {tokenImport.name + ' (' + tokenImport.symbol + ')'}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3">
            <div className="font-normal text-xs tracking-finnieSpacing-wide">Account</div>
            <div className="font-normal text-xs tracking-finnieSpacing-wide">Balance</div>
            <div className="font-normal text-xs tracking-finnieSpacing-wide">Add Token</div>
          </div>
        </div>
      )}
    </div>
  )
}
