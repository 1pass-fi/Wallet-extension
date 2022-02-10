import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import formatLongString from 'finnie-v2/utils/formatLongString'

import ArLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'

import Hint from 'finnie-v2/components/Hint'
import CheckBox from 'finnie-v2/components/CheckBox'

const tabs = ['AR', 'ETH']

const AccountManagement = ({ accounts, setSelectedAccount, setShowExportBackupPhraseModal }) => {
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
          {showAccounts.map((account, idx) => {
            const hasSeedPhrase = !isEmpty(account.seedPhrase)
            return (
              <tr
                key={idx}
                className={clsx(
                  'text-left h-8',
                  idx % 2 === 1 && 'bg-lightBlue',
                  !hasSeedPhrase && 'bg-trueGray-100 text-blueGray-500'
                )}
              >
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
                <td className="w-50 ">
                  <button
                    className={clsx(
                      'text-center text-xs tracking-finnieSpacing-wide h-6 w-32 rounded-sm shadow-sm',
                      !hasSeedPhrase
                        ? 'bg-trueGray-400 text-blueGray-600 cursor-not-allowed'
                        : 'text-white bg-blue-800'
                    )}
                    disabled={!hasSeedPhrase}
                    onClick={() => {
                      setSelectedAccount(account)
                      setShowExportBackupPhraseModal(true)
                    }}
                  >
                    {hasSeedPhrase ? 'Get Phrase' : 'Unavailable'}
                  </button>
                  {!hasSeedPhrase && (
                    <Hint
                      className="inline ml-4.25"
                      text="This key was not <br>generated with a<br>recovery phrase.<br>Keys can only<br>generate recovery<br>phrases at creation."
                      place="right"
                    />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default AccountManagement
