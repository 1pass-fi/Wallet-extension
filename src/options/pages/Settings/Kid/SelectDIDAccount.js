import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import clsx from 'clsx'
import { isEmpty } from 'lodash'

import { GalleryContext } from 'options/galleryContext'
import { DidContext } from 'options/context'

import { setDefaultAccount } from 'options/actions/defaultAccount'
import { getArAccounts } from 'options/selectors/accounts'

import Button from 'finnie-v2/components/Button'

import CloseIcon from 'img/v2/close-icon-blue.svg'
import CopyIcon from 'img/v2/copy-icon.svg'
import Background from 'img/v2/select-DID-modal-background.svg'
import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import FavoriteIcon from 'img/v2/favorite-icon.svg'
import FavoriteIconWhite from 'img/v2/favorite-icon-white.svg'

import formatLongString from 'finnie-v2/utils/formatLongString'
import formatNumber from 'finnie-v2/utils/formatNumber'
import { NOTIFICATION } from 'constants/koiConstants'

const SelectDIDAccount = ({ close }) => {
  const { setIsLoading, setNotification, setError } = useContext(GalleryContext)
  const { getDID } = useContext(DidContext)

  const dispatch = useDispatch()
  const modalRef = useRef(null)

  const defaultArAccount = useSelector((state) => state.defaultAccount.AR)
  const arAccounts = useSelector(getArAccounts)

  const [selectedAccount, setSelectedAccount] = useState('')

  const handleChangeDIDAccount = async () => {
    try {
      setIsLoading((prev) => ++prev)
      if (isEmpty(selectedAccount)) {
        setError('Please choose Koii or Arweave account first!')
        return
      }
      await dispatch(setDefaultAccount(selectedAccount))
      await getDID()

      // TODO - LongP
      close()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading((prev) => --prev)
    }
  }

  //   useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (modalRef.current && !modalRef.current.contains(event.target)) {
  //         close()
  //       }
  //     }

  //     document.addEventListener('mousedown', handleClickOutside)
  //     return () => {
  //       document.removeEventListener('mousedown', handleClickOutside)
  //     }
  //   }, [modalRef])

  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-screen bg-black bg-opacity-25 fixed z-51 top-0 left-0">
      <div
        style={{ width: '580px' }}
        className="relative rounded bg-trueGray-100 flex flex-col items-center text-indigo"
        ref={modalRef}
      >
        <div className="flex h-16.75 rounded-t bg-trueGray-100 shadow-md w-full font-semibold text-xl tracking-finnieSpacing-wide relative">
          <div className="m-auto">Select an Account</div>
          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>
        <Background className="absolute" style={{ left: '0px', top: '67px' }} />
        <div
          className="absolute font-normal text-lg text-indigo"
          style={{ width: '303px', right: '31px', top: '152px' }}
        >
          Please select a Koii or Arweave account to create your Decentralized ID.
        </div>
        <div className="mt-50 flex flex-col items-center justify-evenly">
          <div
            className="text-sm font-normal text-center shadow-lg rounded-1"
            style={{ width: '444px' }}
          >
            {arAccounts.map((arAccount, idx) => (
              <div
                className={clsx(
                  'relative h-20 pt-5 flex items-start cursor-pointer',
                  selectedAccount?.address === arAccount?.address ? 'bg-lightBlue' : 'bg-white'
                )}
                key={idx}
                onClick={() => setSelectedAccount(arAccount)}
              >
                <KoiiLogo className="ml-3 mt-1" style={{ width: '25px', height: '25px' }} />
                <div className="ml-2.25 flex flex-col text-left" style={{ width: '156px' }}>
                  <div className="font-bold text-base tracking-finnieSpacing-tight">
                    {formatLongString(arAccount.accountName, 12)}
                  </div>
                  <div className="w-full flex justify-between font-normal text-2xs tracking-finnieSpacing-tight">
                    {formatLongString(arAccount.address, 18)}
                    <CopyToClipboard text={arAccount.address}>
                      <CopyIcon
                        onClick={() => setNotification(NOTIFICATION.ADDRESS_COPIED)}
                        style={{ width: '16px', height: '16px' }}
                      />
                    </CopyToClipboard>
                  </div>
                </div>
                <div
                  className="ml-10 mt-1 flex flex-col font-normal text-xs text-left tracking-finnieSpacing-tight justify-between"
                  style={{ height: '38px' }}
                >
                  <div>Balance: {formatNumber(arAccount.koiBalance, 2)} KOII</div>
                  <div>Assets: {arAccount.totalAssets.length}</div>
                </div>
                {arAccount?.address === defaultArAccount?.address ? (
                  <FavoriteIcon className="absolute right-6 top-4" />
                ) : (
                  <FavoriteIconWhite className="absolute right-6 top-4" />
                )}
                <div
                  className="absolute bottom-0 w-full"
                  style={{ height: '1px', backgroundColor: '#D6D6D6' }}
                ></div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between" style={{ width: '404px' }}>
            <Button
              style={{ width: '180px', height: '38px' }}
              className="h-10 text-base rounded w-43.75 mx-auto mb-6.5"
              variant="indigo"
              text="Select"
              onClick={handleChangeDIDAccount}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectDIDAccount
