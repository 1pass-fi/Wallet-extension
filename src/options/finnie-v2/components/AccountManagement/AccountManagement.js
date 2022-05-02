import clsx from 'clsx'
import React, { useMemo, useRef, useState, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import DropDown from 'finnie-v2/components/DropDown'
import formatLongString from 'finnie-v2/utils/formatLongString'

import ArLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'
import CopyIcon from 'img/v2/copy-icon.svg'
import EditIcon from 'img/v2/edit-icon.svg'
import RecycleBinIcon from 'img/v2/recycle-bin-icon.svg'

import storage from 'services/storage'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import { popupAccount } from 'services/account'

import { setAccounts } from 'options/actions/accounts'
import { setDefaultAccountByAddress } from 'options/actions/defaultAccount'
import { GalleryContext } from 'options/galleryContext'
import { DidContext } from 'options/context'

import CheckBox from 'finnie-v2/components/CheckBox'
import { TYPE } from 'constants/accountConstants'

const Address = ({ address }) => {
  const [isCopied, setIsCopied] = useState(false)

  const onCopy = () => {
    setIsCopied(true)

    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <>
      {formatLongString(address, 22)}
      <div className="relative inline ">
        <CopyToClipboard text={address} onCopy={onCopy}>
          <CopyIcon className="inline cursor-pointer w-3.25 ml-2" />
        </CopyToClipboard>
        {isCopied && (
          <span className="text-11px absolute top-0 -right-13 text-blue-800">Copied!</span>
        )}
      </div>
    </>
  )
}

const AccountManagement = ({ accounts, setShowConfirmRemoveAccount, setRemoveAccount }) => {
  const { setNotification, setError } = useContext(GalleryContext)
  const { getDID } = useContext(DidContext)

  const dispatch = useDispatch()
  const defaultArweaveAccountAddress = useSelector((state) => state.defaultAccount.AR?.address)
  const defaultEthereumAccountAddress = useSelector((state) => state.defaultAccount.ETH?.address)

  const inputAccountNameRef = useRef(null)

  const [editAccount, setEditAccount] = useState({})
  const [accountName, setAccountName] = useState('')

  const reloadDefaultAccount = async () => {
    const activatedArweaveAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
    dispatch(setDefaultAccountByAddress(activatedArweaveAccountAddress))

    const activatedEthereumAccountAddress = await storage.setting.get.activatedEthereumAccountAddress()
    dispatch(setDefaultAccountByAddress(activatedEthereumAccountAddress))
  }

  const handleSetDefaultAccount = async (address) => {
    try {
      await backgroundRequest.gallery.setDefaultAccount({ address })
      await reloadDefaultAccount()
      getDID()
      setNotification(`Set default account successfully.`)
    } catch (err) {
      setError(err.message)
    }
  }

  // @TODO
  // Still in use
  // const options = useMemo(
  //   () =>
  //     currentTab === 'ETH'
  //       ? [
  //         { label: 'Ethereum Mainnet', value: 'mainnet' },
  //         { label: 'Rinkeby Testnet', value: 'testnet' }
  //       ]
  //       : [
  //         { label: 'AR Mainnet', value: 'mainnet' },
  //         { label: 'AR Testnet', value: 'testnet' }
  //       ],
  //   [currentTab]
  // )

  const handleChangeAccountName = async (account) => {
    try {
      if (editAccount !== account) {
        setEditAccount(account)
        setAccountName(account.accountName)
      } else {
        if (accountName !== account.accountName) {
          await backgroundRequest.wallet.changeAccountName({
            address: account.address,
            newName: accountName
          })
          const allData = await popupAccount.getAllMetadata()
          dispatch(setAccounts(allData))
        }
        setEditAccount({})
      }
    } catch (err) {
      dispatch(setError(err.message))
    }
  }

  useEffect(() => {
    inputAccountNameRef.current?.focus()
  }, [editAccount])

  return (
    <>
      <table className="bg-trueGray-100 rounded-finnie text-indigo" style={{ width: '588px' }}>
        <thead className="text-4xs font-normal">
          <tr className="text-left h-8">
            <td className="w-4 pl-2">DEFAULT</td>
            <td className="w-10 pl-2">CHAIN</td>
            <td className="w-48 pl-6.5">ACCOUNT NAME</td>
            <td className="w-52">ADDRESS</td>
            {/* <td>LAYER</td> */}
            <td className="text-center w-18">REMOVE</td>
          </tr>
        </thead>
        <tbody className="text-xs tracking-finnieSpacing-wide">
          {accounts.map((account, idx) => (
            <tr key={idx} className={clsx('text-left h-8', idx % 2 === 1 && 'bg-lightBlue')}>
              <td className="pl-2">
                <CheckBox
                  onClick={() => handleSetDefaultAccount(account.address)}
                  checked={
                    defaultArweaveAccountAddress === account.address ||
                    defaultEthereumAccountAddress === account.address
                  }
                />
              </td>
              <td className="w-10 pl-2">
                {account.type === TYPE.ARWEAVE && (
                  <ArLogo className="inline w-6 h-6 shadow-sm rounded-full" />
                )}
                {account.type === TYPE.ETHEREUM && (
                  <EthLogo className="inline w-6 h-6 shadow-sm rounded-full" />
                )}
              </td>
              <td>
                <div className="flex items-center">
                  {editAccount?.address === account.address ? (
                    <input
                      ref={(accountNameInput) => (inputAccountNameRef.current = accountNameInput)}
                      className="w-28 ml-5 pl-1.5 bg-trueGray-400 bg-opacity-50 rounded-t-sm border-b-2 border-blue-850 focus:outline-none"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      style={{ height: '17.23px' }}
                    />
                  ) : (
                    <div className="max-w-24 pl-6.5">
                      {formatLongString(account.accountName, 12)}
                    </div>
                  )}
                  <EditIcon
                    onClick={() => handleChangeAccountName(account)}
                    className="inline cursor-pointer ml-2.25 mr-6"
                    style={{ width: '13px', height: '13px' }}
                  />
                </div>
              </td>
              <td>
                <Address address={account.address} key={account.address} />
              </td>
              {/* Still in use */}
              {/* <td className="w-50 pr-10">
                <DropDown size="sm" variant="light" options={options} value="mainnet" />
              </td> */}
              <td className="flex w-full h-8 items-center justify-center">
                <div
                  className="w-5 h-5 flex items-center justify-center bg-warning-300 rounded-sm shadow cursor-pointer"
                  onClick={() => {
                    setShowConfirmRemoveAccount(true)
                    setRemoveAccount(account)
                  }}
                >
                  <RecycleBinIcon style={{ width: '14px', height: '16px' }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default AccountManagement
