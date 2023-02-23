import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { TYPE } from 'constants/accountConstants'
import { getDisplayingAccount } from 'options/selectors/displayingAccount'

const ArweaveOnly = ({ content, children }) => {
  return (
    <div className="relative flex flex-col">
      <div className="absolute flex flex-col items-center text-white text-center font-normal text-sm leading-6 mx-4">
        {content}
        <NavLink
          key="/settings/wallet"
          to="/settings/wallet"
          className="flex items-center justify-center bg-trueGray-100 shadow rounded-sm mt-4 text-indigo cursor-pointer"
          style={{ width: '200px', height: '38px' }}
        >
          {chrome.i18n.getMessage('switchAccounts')}
        </NavLink>
        <NavLink
          key="/create-wallet"
          to="/create-wallet"
          className="flex items-center justify-center border border-white shadow rounded-sm mt-5.5 mb-5.25 cursor-pointer"
          style={{ width: '200px', height: '38px' }}
        >
          {chrome.i18n.getMessage('getAnArKey')}
        </NavLink>
      </div>
      <div className="absolute cursor-not-allowed" style={{ top: '230px' }}>
        {/* <div className="absolute w-full h-full bg-blue-700 cursor-not-allowed"></div> */}
        <div className="bg-trueGray-100 bg-opacity-40 pointer-events-none rounded">{children}</div>
      </div>
    </div>
  )
}

export default ({ children, content, hasArweaveAccounts = false }) => {
  const displayingAccount = useSelector(getDisplayingAccount)

  return displayingAccount.type === TYPE.ARWEAVE || hasArweaveAccounts ? (
    children
  ) : (
    <ArweaveOnly content={content} children={children} />
  )
}
