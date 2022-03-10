import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import ArrowIcon from 'img/down-arrow-icon.svg'
import EthereumIcon from 'img/popup/ethereum-icon.svg'
import FinnieIcon from 'img/popup/finnie-icon.svg'

import { TYPE } from 'constants/accountConstants'

const Account = ({ showAccountDropdown, setShowAccountDropdown }) => {
  const defaultArweaveAccount = useSelector((state) => state.defaultAccount.AR)
  const defaultEthereumAccount = useSelector((state) => state.defaultAccount.ETH)
  const [defaultAccount, setDefaultAccount] = useState({})

  useEffect(() => {
    if (!isEmpty(defaultArweaveAccount.address)) {
      setDefaultAccount(defaultArweaveAccount)
      return
    }
    if (!isEmpty(defaultEthereumAccount.address)) {
      setDefaultAccount(defaultEthereumAccount)
      return
    }
  }, [defaultArweaveAccount, defaultEthereumAccount])

  return (
    <div
      className="bg-blue-800 flex items-center justify-between cursor-pointer select-none"
      style={{ width: '249px', height: '100%' }}
      onClick={() => {
        setShowAccountDropdown((prev) => !prev)
      }}
    >
      <div className="ml-2.5 flex items-center">
        {defaultAccount.type === TYPE.ARWEAVE && (
          <FinnieIcon style={{ width: '25px', height: '25px' }} />
        )}
        {defaultAccount.type === TYPE.ETHEREUM && (
          <EthereumIcon style={{ width: '25px', height: '25px' }} />
        )}
        <div className="ml-2 font-semibold text-base leading-8 tracking-finnieSpacing-tight text-white">
          {defaultAccount?.accountName}
        </div>
      </div>
      <ArrowIcon
        className="mr-6.5"
        style={{ transform: !showAccountDropdown ? 'none' : 'rotateX(180deg)' }}
      />
    </div>
  )
}

export default Account
