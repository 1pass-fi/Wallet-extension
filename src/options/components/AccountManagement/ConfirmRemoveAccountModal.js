import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TYPE } from 'constants/accountConstants'
import { MESSAGES } from 'constants/koiConstants'
import BackIcon from 'img/v2/back-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-blue.svg'
import { find, isEmpty } from 'lodash'
import { setAccounts } from 'options/actions/accounts'
import { setActivatedChain } from 'options/actions/activatedChain'
import { setDefaultAccount } from 'options/actions/defaultAccount'
import { setError } from 'options/actions/error'
import { setIsLoading, setLoaded } from 'options/actions/loading'
import Button from 'options/components/Button'
import { GalleryContext } from 'options/galleryContext'
import formatLongString from 'options/utils/formatLongString'
import { popupAccount } from 'services/account'
// services
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import storage from 'services/storage'

const ConfirmRemoveAccountModal = ({ account, close }) => {
  const dispatch = useDispatch()

  const [isRemoving, setIsRemoving] = useState(false)
  const modalRef = useRef(null)

  const defaultAccount = useSelector((state) => state.defaultAccount)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        close()
      }
    }

    const handlePressingEsc = (event) => {
      if (event.defaultPrevented) {
        return // Should do nothing if the default action has been cancelled
      }

      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handlePressingEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handlePressingEsc)
    }
  }, [modalRef])

  const handleRemoveAccount = async () => {
    try {
      setIsRemoving(true)
      dispatch(setIsLoading)

      await backgroundRequest.wallet.removeWallet({ address: account.address })

      await popupAccount.loadImported() // update accounts list for popupAccount
      const accountStates = await popupAccount.getAllMetadata()
      dispatch(setAccounts(accountStates))

      const activatedChain = await storage.setting.get.activatedChain()

      /* 
        Have to handle removing this address from activatedAccount if this
        address is the activated account.
      */
      if (accountStates.length !== 0) {
        const arAccount = find(accountStates, (v) => v.type === TYPE.ARWEAVE)
        const k2Account = find(accountStates, (v) => v.type === TYPE.K2)
        const ethAccount = find(accountStates, (v) => v.type === TYPE.ETHEREUM)
        const solAccount = find(accountStates, (v) => v.type === TYPE.SOLANA)

        let emptyActivatedChainAccount = false

        if (account.type === TYPE.ARWEAVE) {
          if (account.address === defaultAccount.AR?.address) {
            if (!isEmpty(arAccount)) {
              dispatch(setDefaultAccount(arAccount))
            } else {
              emptyActivatedChainAccount = true
            }
          }
        }
        if (account.type === TYPE.K2) {
          if (account.address === defaultAccount.K2?.address) {
            if (!isEmpty(k2Account)) {
              dispatch(setDefaultAccount(k2Account))
            } else {
              emptyActivatedChainAccount = true
            }
          }
        }
        if (account.type === TYPE.ETHEREUM) {
          if (account.address === defaultAccount.ETH?.address) {
            if (!isEmpty(ethAccount)) {
              dispatch(setDefaultAccount(ethAccount))
            } else {
              emptyActivatedChainAccount = true
            }
          }
        }
        if (account.type === TYPE.SOLANA) {
          if (account.address === defaultAccount.SOL?.address) {
            if (!isEmpty(solAccount)) {
              dispatch(setDefaultAccount(solAccount))
            } else {
              emptyActivatedChainAccount = true
            }
          }
        }

        // TODO DatH - LongP
        if (account.type === activatedChain && emptyActivatedChainAccount) {
          await storage.setting.set.activatedChain(accountStates[0].type)
          dispatch(setActivatedChain(accountStates[0].type))
        }
      }

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.ACCOUNTS_CHANGED })
      })

      close()
      dispatch(setLoaded)
      setIsRemoving(false)
    } catch (error) {
      dispatch(setLoaded)
      setIsRemoving(false)
      console.log('Failed to remove account - Error: ', error.message)
      dispatch(setError(error.message))
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
          <div className="m-auto">Remove Account</div>
          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>
        <div className="mt-7.5 flex flex-col items-center justify-evenly">
          <div
            className="font-bold text-lg text-indigo leading-6 text-center"
            style={{ width: '303px' }}
          >
            Are you sure you want to remove "{formatLongString(account.accountName, 25)}"?
          </div>
          <div className="mt-6 text-sm font-normal text-center" style={{ width: '485px' }}>
            This will erase all account information from Finnie, but you can import it again with
            the secret phrase.
          </div>
          <div className="mt-4 flex justify-between" style={{ width: '404px' }}>
            <Button
              style={{ width: '180px', height: '39px' }}
              className="h-10 mt-5 text-base rounded w-43.75 mx-auto mb-8"
              variant="warning300"
              text="Remove Account"
              onClick={() => handleRemoveAccount()}
              disabled={isRemoving}
              data-testid="confirm-remove-account-button"
            />

            <Button
              style={{ width: '180px', height: '39px' }}
              className="h-10 mt-5 text-base rounded w-43.75 mx-auto mb-8"
              variant="indigo"
              text="Cancel"
              onClick={close}
              data-testid="cancel-remove-account-button"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmRemoveAccountModal
