// modules
import React, { useState } from 'react'
import { connect } from 'react-redux'
import getSymbolFromCurrency from 'currency-symbol-map'
import { CopyToClipboard } from 'react-copy-to-clipboard'

// assets
import CopyIcon from 'img/copy-icon.svg'
import EditIcon from 'img/edit-icon.svg'
import RearrangeIcon from 'img/rearrange-pads-icon.svg'
import Fish from 'img/koi-logo-bg.svg'
import EthereumIcon from 'img/ethereum-logo.svg'
import CollapseIcon from 'img/collapse-icon.svg'
import ExtendIcon from 'img/extend-icon.svg'

// components
import EditAccountNameModal from 'popup/components/modals/editAccountNameModal'
import useNetworkSelection from 'shared/useNetworkSelection'

// actions
import { setAccounts } from 'popup/actions/accounts'
import { changeAccountName } from 'actions/koi'
import { setNotification } from 'actions/notification'
import { setAccountName } from 'actions/accountName'

// utils
import { fiatCurrencyFormat, getProviderNameFromUrl, numberFormat } from 'utils'

// constants
import { NOTIFICATION } from 'constants/koiConstants'
import { TYPE } from 'constants/accountConstants'

// styles
import './index.css'


export const AccountInfo = (({
  setNotification,
  price,
  currency,
  collapsed,
  setCollapsed,
  account,
  changeAccountName
}) => {
  const [openEditModal, setOpenEditModal] = useState(false)
  const {
    NetworkSelection,
    selectedNetwork,
  } = useNetworkSelection(account.type)

  const onSubmit = async (newName) => {
    await changeAccountName(account.address, newName)

    setNotification(NOTIFICATION.ACCOUNT_NAME_UPDATED)
    setOpenEditModal(false)
  }

  const onClose = () => {
    setOpenEditModal(false)
  }

  return (
    <div className='wallet-info'>
      <RearrangeIcon className='rearrange-icon' />
      <div className='wallet-info-row'>
        <div className='fish'>
          {account.type == TYPE.ARWEAVE ? <Fish /> : <EthereumIcon />}
        </div>
        <div>
          <div className='name'>
            <div className='text'>{account.accountName}</div>
            <div onClick={() => setOpenEditModal(true)}>
              <div className='icon'><EditIcon /></div>
            </div>
          </div>
          <div className='addr'>
            <div>
              {`${account.address.slice(0, 6)}...${account.address.slice(account.address.length - 4)}`}
            </div>
            <div onClick={() => setNotification(NOTIFICATION.COPIED)}>
              <CopyToClipboard text={account.address}>
                <div className="icon">
                  <CopyIcon/>
                </div>
              </CopyToClipboard>
            </div>
          </div>
          {/* <NetworkSelection /> */}
          <div className='network-name'>{getProviderNameFromUrl(account.provider)}</div>
        </div>
      </div>
      <div className='wallet-balance-row'>
        {!collapsed ? 
          <div className='collapse-icon' onClick={() => setCollapsed(true)}>
            <CollapseIcon />
          </div> :
          <div className='collapse-icon' onClick={() => setCollapsed(false)}>
            <ExtendIcon />
          </div>
        }
        {account.type !== TYPE.ETHEREUM && <div className='koi-balance'>
          <div className='balance'>{numberFormat(account.koiBalance)} KOII</div>
          {<div hidden className='usd-exchange'>${fiatCurrencyFormat(account.koiBalance * price.KOI)} USD</div>}
        </div>}
        {(account.type == TYPE.ETHEREUM || !collapsed) && 
          <div className='ar-balance'>
            <div className='balance'>{numberFormat(account.balance)} {account.type == TYPE.ARWEAVE ? 'AR' : 'ETH'}</div>
            {<div className='usd-exchange'>{getSymbolFromCurrency(currency) || ''}{fiatCurrencyFormat(account.balance * price.AR)} {currency}</div>}
          </div>
        }
      </div>
      { openEditModal && 
        <EditAccountNameModal 
          onClose={onClose} 
          onSubmit={onSubmit} 
          currentName={account.name}
          account={account}
        /> }
    </div>
  )
})

const mapStateToProps = (state) => ({
  accountName: state.accountName,
  koi: state.koi,
  price: state.price,
  currency: state.currency,
  ethereum: state.ethereum
})

const mapDispatchToProps = { setAccountName, setNotification, setAccounts, changeAccountName }

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo)
