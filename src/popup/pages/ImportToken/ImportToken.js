import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
import BackBtn from 'img/popup/back-button.svg'
import isEmpty from 'lodash/isEmpty'
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'

import CustomToken from './CustomToken'
import ImportTokenForm from './ImportTokenForm'
// components
import Search from './Search'

export const ImportToken = () => {
  const displayingAccount = useSelector(getDisplayingAccount)
  const history = useHistory()

  const [tabs, setTabs] = useState([
    { name: chrome.i18n.getMessage('search'), to: 'SEARCH_TOKEN' },
    { name: chrome.i18n.getMessage('customToken'), to: 'CUSTOM_TOKEN' }
  ])
  const [currentTab, setCurrentTab] = useState('SEARCH_TOKEN')
  const [tokenImport, setTokenImport] = useState({})
  const [searchToken, setSearchToken] = useState('')

  // useEffect(() => {
  //   if (displayingAccount?.type === TYPE.SOLANA || displayingAccount?.type === TYPE.K2) {
  //     setTabs([{ name: 'Search', to: 'SEARCH_TOKEN' }])
  //   }
  // }, [displayingAccount])

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
        <div className="ml-6 font-semibold text-lg text-blue-800">{chrome.i18n.getMessage('importAToken')}</div>
      </div>

      {isEmpty(tokenImport) ? (
        <>
          <div className="flex sticky font-normal text-base leading-5 text-blue-850 mt-2 px-6">
            {tabs.map((tab, idx) => (
              <div
                key={idx}
                className={clsx(
                  'w-full h-10.75 flex items-center justify-center cursor-pointer',
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
