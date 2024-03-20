import React from 'react'
import { useSelector } from 'react-redux'
import { TYPE } from 'constants/accountConstants'
import ArrowIcon from 'img/down-arrow-icon.svg'
import EvmLogo from 'img/evm-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'
// import FinnieIcon from 'img/popup/finnie-icon.svg'
import K2Logo from 'img/v2/k2-logos/finnie-k2-logo.svg'
import SolanaIcon from 'img/v2/solana-logo.svg'
import isEmpty from 'lodash/isEmpty'
import formatLongString from 'options/utils/formatLongString'
// selectors
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'

const Account = ({ showAccountDropdown, setShowAccountDropdown }) => {
  const displayingAccount = useSelector(getDisplayingAccount)

  return (
    <div
      className="flex items-center justify-between cursor-pointer select-none"
      style={{ width: '341px', height: '100%', backgroundColor: '#353570'}}
      onClick={() => {
        setShowAccountDropdown((prev) => !prev)
      }}
      data-testid="popup-header-displayingaccount"
    >
      {isEmpty(displayingAccount?.address) ? (
        <div className="ml-3.75 font-semibold text-base leading-8 tracking-finnieSpacing-tight text-white">
          {chrome.i18n.getMessage('selectAccountPh')}
        </div>
      ) : (
        <div className="ml-2.5 flex items-center">
          {displayingAccount.type === TYPE.ARWEAVE && (
            <ArweaveIcon style={{ width: '25px', height: '25px' }} />
          )}
          {displayingAccount.type === TYPE.K2 && (
            <K2Logo style={{ width: '25px', height: '25px' }} />
          )}
          {displayingAccount.type === TYPE.ETHEREUM && (
            <EvmLogo style={{ width: '25px', height: '25px' }} />
          )}
          {displayingAccount.type === TYPE.SOLANA && (
            <SolanaIcon style={{ width: '25px', height: '25px' }} />
          )}
          <div className="ml-2 font-semibold text-base leading-8 tracking-finnieSpacing-tight text-white">
            {formatLongString(displayingAccount?.accountName, 12)}
          </div>
        </div>
      )}

      <ArrowIcon
        className="mr-6.5"
        style={{ transform: !showAccountDropdown ? 'none' : 'rotateX(180deg)' }}
      />
    </div>
  )
}

export default Account
