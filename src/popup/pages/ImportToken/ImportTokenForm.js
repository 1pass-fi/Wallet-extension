import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

import Checkbox from 'popup/components/shared/checkBoxRedesign'

// utils
import formatNumber from 'finnie-v2/utils/formatNumber'

import FinnieIcon from 'img/popup/finnie-icon-blue.svg'
import clsx from 'clsx'

const ImportTokenForm = ({ tokenImport, goBack }) => {
  const history = useHistory()

  const [selectedAccount, setSelectedAccount] = useState([])

  const handleSelectAccount = (account) => {
    let currentSelectedAccount = [...selectedAccount]
    if (currentSelectedAccount.includes(account)) {
      currentSelectedAccount = currentSelectedAccount.filter((a) => a !== account)
    } else {
      currentSelectedAccount.push(account)
    }

    setSelectedAccount(currentSelectedAccount)
  }

  const handleImportToken = () => {
    // TODO LongP
    console.log('selectedAccount', selectedAccount)
    history.push('*')
  }

  const accounts = useSelector((state) => state.accounts)
  return (
    <div className="mt-6 px-6 text-blue-800">
      <div className="font-normal text-base tracking-finnieSpacing-tight">
        To which wallet(s) do you want to import these tokens?
      </div>
      <div className="mt-4 text-xs font-normal tracking-finnieSpacing-wide">Token</div>
      <div className="flex items-start mt-2" style={{ height: '36px' }}>
        <FinnieIcon style={{ width: '36px', height: '36px' }} />
        <div className="ml-3 mt-1 flex flex-col items-start justify-center">
          <div className="font-normal text-base tracking-finnieSpacing-tight">
            {tokenImport.name + ' (' + tokenImport.symbol + ')'}
          </div>
          <div className="flex font-normal text-11px leading-4 tracking-finnieSpacing-wide text-success-700">
            {!isEmpty(selectedAccount) && tokenImport.contract}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 mb-3 font-normal text-xs tracking-finnieSpacing-wide text-center">
        <div className="text-left">Account</div>
        <div>Balance</div>
        <div>Add Token</div>
      </div>
      <div className="overflow-y-scroll" style={{ maxHeight: '168px' }}>
        {accounts.map((account, idx) => (
          <div className="grid grid-cols-3 mb-6.5" key={idx}>
            <div className="flex flex-col">
              <div className="font-normal text-base leading-5 text-blue-800">
                {account.accountName}
              </div>
              <div className="mt-0.5 font-normal text-xs leading-4 tracking-finnieSpacing-wide text-success-700">
                {account.address.substring(0, 7)}
                ...
                {account.address.substring(40, 43)}
              </div>
            </div>
            <div className="flex justify-center font-normal text-base leading-5 text-blue-800">
              {formatNumber(account.balance, 3) + ' ' + tokenImport.symbol}
            </div>
            <Checkbox
              isDisabled={false}
              defaultChecked={selectedAccount.includes(account)}
              onChange={() => handleSelectAccount(account)}
              className="flex justify-center"
              isNewDesign={true}
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-20 w-full flex">
        <button
          onClick={goBack}
          className="ml-4 bg-white border-2 border-blue-800 rounded-sm shadow text-base leading-4 text-center text-blue-800"
          style={{ width: '160px', height: '38px' }}
        >
          Back
        </button>
        <button
          onClick={() => handleImportToken()}
          className={clsx(
            'ml-6 bg-blue-800 rounded-sm shadow text-base leading-4 text-center text-white',
            isEmpty(selectedAccount) && 'cursor-not-allowed bg-opacity-80'
          )}
          style={{ width: '160px', height: '38px' }}
          disabled={isEmpty(selectedAccount)}
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

export default ImportTokenForm
