import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import clsx from 'clsx'

import BackBtn from 'img/popup/back-button.svg'

// components
import Search from './Search'
import CustomToken from './CustomToken'
import ImportTokenForm from './ImportTokenForm'

const tabs = [
  { name: 'Search', to: 'SEARCH_TOKEN' },
  { name: 'Custom Token', to: 'CUSTOM_TOKEN' }
]

export const ImportToken = () => {
  const history = useHistory()

  const [currentTab, setCurrentTab] = useState('SEARCH_TOKEN')
  const [tokenImport, setTokenImport] = useState({})
  const [searchToken, setSearchToken] = useState('')

  return (
    <div className="w-full h-full">
      <div
        className="bg-trueGray-100 shadow-md flex items-center"
        style={{ width: '426px', height: '48px' }}
      >
        <BackBtn
          onClick={() => {
            if (isEmpty(tokenImport)) {
              history.goBack()
            } else {
              setTokenImport({})
            }
          }}
          className="w-8.75 h-8.75 ml-3.75 cursor-pointer bg-white bg-opacity-70 rounded-full"
        />
        <div className="ml-6 font-semibold text-lg text-blue-800">Import a Token</div>
      </div>

      {isEmpty(tokenImport) ? (
        <>
          <div className="flex sticky font-normal text-base leading-5 text-blue-850 mt-2">
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
          {currentTab === 'SEARCH_TOKEN' && (
            <Search
              setTokenImport={setTokenImport}
              searchToken={searchToken}
              setSearchToken={setSearchToken}
            />
          )}
          {currentTab === 'CUSTOM_TOKEN' && <CustomToken setTokenImport={setTokenImport} />}
        </>
      ) : (
        <ImportTokenForm tokenImport={tokenImport} goBack={() => setTokenImport({})} />
      )}
    </div>
  )
}