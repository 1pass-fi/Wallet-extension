import clsx from 'clsx'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import formatLongString from 'finnie-v2/utils/formatLongString'

import ArLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'

import CheckBox from './CheckBox'

const tabs = ['AR', 'ETH']

const AccountManagement = ({ accounts }) => {
  const defaultAccountAddress = useSelector((state) => state.defaultAccount?.address)

  const [currentTab, setCurrentTab] = useState('AR')

  const showAccounts = useMemo(
    () => accounts.filter((account) => account.type.includes(currentTab)),
    [currentTab]
  )

  const changeTab = (newTab) => setCurrentTab(newTab)

  return (
    <>
      <div className="flex items-center justify-start gap-10 font-bold text-xs mb-4">
        {tabs.map((tab) => (
          <div
            className={clsx(
              'cursor-pointer',
              currentTab === tab && 'text-success border-b-2 border-success'
            )}
            onClick={() => changeTab(tab)}
            key={tab}
          >{`${tab} wallets`}</div>
        ))}
      </div>
      <table className="w-full bg-trueGray-100 rounded-finnie text-indigo">
        <thead className="text-4xs font-normal">
          <tr className="text-left h-8">
            <td className="pl-2">DEFAULT</td>
            <td className="text-center">ACCOUNT NAME</td>
            <td>ADDRESS</td>
            <td />
          </tr>
        </thead>
        <tbody className="text-xs tracking-finnieSpacing-wide">
          {showAccounts.map((account, idx) => (
            <tr key={idx} className={clsx('text-left h-8', idx % 2 === 1 && 'bg-lightBlue')}>
              <td className="pl-2">
                <CheckBox checked={defaultAccountAddress === account.address} />
              </td>
              <td>
                {currentTab === 'AR' ? (
                  <ArLogo className="inline mr-2 w-6 h-6 shadow-sm rounded-full" />
                ) : (
                  <EthLogo className="inline mr-2 w-6 h-6 shadow-sm rounded-full" />
                )}
                {formatLongString(account.accountName, 12)}
              </td>
              <td>{formatLongString(account.address, 22)}</td>
              <td className="w-50 pr-10">
                <button className="bg-blue-800 text-center text-white text-xs tracking-finnieSpacing-wide h-6 w-32">
                  Get Phrase
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default AccountManagement
