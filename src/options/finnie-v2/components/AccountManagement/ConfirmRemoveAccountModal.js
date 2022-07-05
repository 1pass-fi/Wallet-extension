import React, { useContext, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import { GalleryContext } from 'options/galleryContext'

// services
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import { popupAccount } from 'services/account'

import { setAccounts } from 'options/actions/accounts'
import { setDefaultAccount } from 'options/actions/defaultAccount'

import Button from 'finnie-v2/components/Button'

import BackIcon from 'img/v2/back-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-blue.svg'

import { TYPE } from 'constants/accountConstants'
import { MESSAGES } from 'constants/koiConstants'
import storage from 'services/storage'
import formatLongString from 'finnie-v2/utils/formatLongString'

const ConfirmRemoveAccountModal = ({ account, close }) => {
  const { setIsLoading, setError, setActivatedChain } = useContext(GalleryContext)
  const dispatch = useDispatch()
  const modalRef = useRef(null)

  const defaultAccount = useSelector(state => state.defaultAccount)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalRef])

  const handleRemoveAccount = async () => {
    try {
      setIsLoading((prev) => ++prev)

      await backgroundRequest.wallet.removeWallet({ address: account.address })

      await popupAccount.loadImported() // update accounts list for popupAccount
      const accountStates = await popupAccount.getAllMetadata()
      dispatch(setAccounts(accountStates))

      /* 
        Have to handle removing this address from activatedAccount if this
        address is the activated account.
      */
      // TODO LongP - handle SOLANA cases
      if (accountStates.length !== 0) {
        const arAccount = find(accountStates, (v) => v.type === TYPE.ARWEAVE)
        const ethAccount = find(accountStates, (v) => v.type === TYPE.ETHEREUM)

        if (account.type === TYPE.ARWEAVE) {
          if (account.address === defaultAccount.AR?.address) {
            if (!isEmpty(arAccount)) {
              dispatch(setDefaultAccount(arAccount))
            }
          }
        }
        if (account.type === TYPE.ETHEREUM) {
          if (account.address === defaultAccount.ETH?.address) {
            if (!isEmpty(ethAccount)) {
              dispatch(setDefaultAccount(ethAccount))
            }
          }
        }
      }

      const totalArweaveAccount = await popupAccount.count(TYPE.ARWEAVE)
      const totalEthereumAccount = await popupAccount.count(TYPE.ETHEREUM)

      if (totalArweaveAccount === 0) {
        await storage.setting.set.activatedChain(TYPE.ETHEREUM)
        setActivatedChain(TYPE.ETHEREUM)
      }

      if (totalEthereumAccount === 0) {
        await storage.setting.set.activatedChain(TYPE.ARWEAVE)
        setActivatedChain(TYPE.ARWEAVE)
      }

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.ACCOUNTS_CHANGED })
      })

      close()
      setIsLoading((prev) => --prev)
    } catch (error) {
      setIsLoading((prev) => --prev)
      console.log('Failed to remove account - Error: ', error.message)
      setError(error.message)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-screen bg-black bg-opacity-25 fixed z-51 top-0 left-0">
      <div
        style={{ width: '586px' }}
        className="rounded bg-trueGray-100 flex flex-col items-center text-indigo"
        ref={modalRef}
      >
        <div className="flex h-16.75 rounded-t bg-trueGray-100 shadow-md w-full font-semibold text-xl tracking-finnieSpacing-wide relative">
          {/* <BackIcon onClick={close} className="w-7 h-7 top-4 left-4 absolute cursor-pointer" /> */}
          <div className="m-auto">Delete Account</div>
          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>{' '}
        <div className="mt-7.5 flex flex-col items-center justify-evenly">
          <div
            className="font-bold text-lg text-indigo leading-6 text-center"
            style={{ width: '303px' }}
          >
            Are you sure you want to delete {formatLongString(account.accountName, 25)}?
          </div>
          <div className="mt-6 text-sm font-normal text-center" style={{ width: '485px' }}>
            This will erase all account information from Finnie but you’ll still be able to import
            it if you have a seed phrase
          </div>
          <div className="mt-4 flex justify-between" style={{ width: '404px' }}>
            <Button
              style={{ width: '180px', height: '39px' }}
              className="h-10 mt-5 text-base rounded w-43.75 mx-auto mb-8"
              variant="warning300"
              text="Delete"
              onClick={() => handleRemoveAccount()}
            />

            <Button
              style={{ width: '180px', height: '39px' }}
              className="h-10 mt-5 text-base rounded w-43.75 mx-auto mb-8"
              variant="indigo"
              text="Discard"
              onClick={close}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmRemoveAccountModal
