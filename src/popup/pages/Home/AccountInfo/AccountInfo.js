import clsx from 'clsx'
import capitalize from 'lodash/capitalize'
import React, { useState } from 'react'

import Tokens from './Tokens'
import Assets from './Assets'

const tabs = ['ASSETS', 'TOKENS', 'ACTIVITY']

const AccountInfo = () => {
  const [currentTab, setCurrentTab] = useState('TOKENS')

  return (
    <div className="bg-trueGray-100 text-blue-600 text-base flex flex-col h-full">
      <div className="shadow-lg h-10.75 flex items-stretch">
        {tabs.map((tab, idx) => (
          <div
            key={idx}
            className={clsx(
              'w-1/3 h-10.75 flex items-center justify-center cursor-pointer',
              currentTab === tab && 'font-semibold bg-lightBlue'
            )}
            onClick={() => setCurrentTab(tab)}
          >
            {capitalize(tab)}
          </div>
        ))}
      </div>
      <div>
        {currentTab === 'TOKENS' && <Tokens />}
        {currentTab === 'ASSETS' && <Assets />}
        {currentTab === 'ACTIVITY' && <div>Activity</div>}
      </div>
    </div>
  )
}

export default AccountInfo
