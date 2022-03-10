import clsx from 'clsx'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import formatLongString from 'finnie-v2/utils/formatLongString'

import ArLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'

import CheckBox from 'finnie-v2/components/CheckBox'

const tabs = ['AR', 'ETH']

const AccountManagement = ({ accounts, setSelectedAccount, setShowExportBackupKeyfileModal }) => {
  const defaultArweaveAccountAddress = useSelector((state) => state.defaultAccount.AR?.address)
  const defaultEthereumAccountAddress = useSelector((state) => state.defaultAccount.ETH?.address)

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
      <table className="w-3/5 bg-trueGray-100 rounded-finnie text-indigo">
        <thead className="text-4xs font-normal">
          <tr className="text-left h-8">
            <td className="pl-2">DEFAULT</td>
            <td className="text-center">ACCOUNT NAME</td>
            <td>ADDRESS</td>
          </tr>
        </thead>
        <tbody className="text-xs tracking-finnieSpacing-wide">
          {showAccounts.map((account, idx) => (
            <tr
              key={idx}
              className={(clsx('text-left h-8', idx % 2 === 1 && 'bg-lightBlue'), 'cursor-pointer')}
              onClick={() => {
                setSelectedAccount(account)
                setShowExportBackupKeyfileModal(true)
              }}
            >
              <td className="pl-2">
                <CheckBox
                  checked={
                    defaultArweaveAccountAddress === account.address ||
                    defaultEthereumAccountAddress === account.address
                  }
                />
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
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default AccountManagement
