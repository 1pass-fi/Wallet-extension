import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import './index.css'
import getSymbolFromCurrency from 'currency-symbol-map'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import CopyIcon from 'img/copy-icon.svg'
import EditIcon from 'img/edit-icon.svg'
import Fish from 'img/koi-logo-bg.svg'
import CollapseIcon from 'img/collapse-icon.svg'
import ExtendIcon from 'img/extend-icon.svg'

import EditAccountNameModal from 'popup/components/modals/editAccountNameModal'

import { setNotification } from 'actions/notification'
import { setAccountName } from 'actions/accountName'
import { numberFormat, fiatCurrencyFormat, updateAccountName } from 'utils'
import { NOTIFICATION } from 'koiConstants'
import { Account } from 'account'
import { setAccounts } from 'popup/actions/accounts'

import { TYPE } from 'account/accountConstants'


export const AccountInfo = (({
  accountName,
  koi,
  setNotification,
  setAccountName,
  price,
  currency,
  collapsed,
  setCollapsed,
  ethereum,
  type,
  account,
  setAccounts
}) => {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [accountAddress, setAccountAddress] = useState('')
  const [koiBalance, setKoiBalance] = useState(null)
  const [balance, setBalance] = useState(null)

  const onSubmit = async (newName) => {

    const arweaveAccount = await Account.get({ address: account.address }, TYPE.ARWEAVE)
    await arweaveAccount.set.accountName(newName)

    const accountState = await Account.getAllState()
    setAccounts(accountState)

    // await updateAccountName(newName)
    // setAccountName(newName)
    setNotification(NOTIFICATION.ACCOUNT_NAME_UPDATED)
    setOpenEditModal(false)
  }

  const onClose = () => {
    setOpenEditModal(false)
  }

  useEffect(() => {
    if (type == 'arweave') {
      setAccountAddress(get(koi, 'address'))
      setKoiBalance(get(koi, 'koiBalance'))
      setBalance(get(koi, 'arBalance'))
    } else {
      setAccountAddress(get(ethereum, 'ethAddress'))
      setKoiBalance(get(koi, 'koiBalance'))
      setBalance(get(ethereum, 'ethBalance'))
    }
  }, [koi])

  return (
    <div className='wallet-info'>
      <div className='wallet-info-row'>
        <div className='fish'>
          <Fish />
        </div>
        <div>
          <div className='name'>
            <div className='text'>{account.accountName}</div>
            <div onClick={() => setOpenEditModal(true)}>
              <div className='icon'><EditIcon /></div>
            </div>
          </div>
          <div className='addr'>
            <div>{`${account.address.slice(0, 6)}...${account.address.slice(
              account.address.length - 4
            )}`}</div>
            <div onClick={() => setNotification(NOTIFICATION.COPIED)}>
              <CopyToClipboard text={account.address}>
                <div className="icon">
                  <CopyIcon/>
                </div>
              </CopyToClipboard>
            </div>
          </div>
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
        <div className='koi-balance'>
          <div className='balance'>{numberFormat(account.koiBalance)} KOII</div>
          {<div hidden className='usd-exchange'>${fiatCurrencyFormat(account.koiBalance * price.KOI)} USD</div>}
        </div>
        <div className='ar-balance'>
          <div className='balance'>{numberFormat(account.balance)} AR</div>
          {<div className='usd-exchange'>{getSymbolFromCurrency(currency) || ''}{fiatCurrencyFormat(account.balance * price.AR)} {currency}</div>}
        </div>
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

const mapDispatchToProps = { setAccountName, setNotification, setAccounts }

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo)
