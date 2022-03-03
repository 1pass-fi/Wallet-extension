import React, { useContext, useEffect, useRef, useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import BackIcon from 'img/v2/back-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-blue.svg'
import EyeIcon from 'img/v2/eye-icon.svg'
import EyeIcon1 from 'img/v2/eye-icon-1.svg'
import NoticeIcon from 'img/v2/notice-icon.svg'

import { GalleryContext } from 'options/galleryContext'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import Button from 'finnie-v2/components/Button'
import formatLongString from 'finnie-v2/utils/formatLongString'

const ExportPrivateKeyModal = ({ account, close }) => {
  const modalRef = useRef(null)
  const { setNotification, setError } = useContext(GalleryContext)

  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [password, setPassword] = useState('')

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

  const onExportKeyfile = async () => {
    try {
      const { key } = await backgroundRequest.gallery.getKeyFile({
        password,
        address: account.address
      })
      const filename = 'arweave-key.json'
      const result = JSON.stringify(key)

      const url = 'data:application/json;base64,' + btoa(result)
      chrome.downloads.download({
        url: url,
        filename: filename
      })
      setNotification('Export Private key succesffuly!')
      close()
    } catch (err) {
      if (err.message === 'Incorrect password') {
        setPasswordError(err.message)
      } else {
        setError(err.message)
      }
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-screen bg-black bg-opacity-25 fixed z-51 top-0 left-0">
      <div
        style={{ width: '510px', height: '386px' }}
        className="rounded bg-trueGray-100 flex flex-col items-center text-indigo"
        ref={modalRef}
      >
        <div className="flex h-16.75 rounded-t bg-trueGray-100 shadow-md w-full font-semibold text-xl tracking-finnieSpacing-wide relative">
          <BackIcon onClick={close} className="w-7 h-7 top-4 left-4 absolute cursor-pointer" />
          <div className="m-auto">Export Private Key</div>
          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>

        <div className="mt-7.5 flex flex-col items-center justify-evenly">
          <div>
            <span className="font-bold text-lg text-indigo leading-6">{account.accountName} :</span>
            <span className="text-success-700 ml-2.75 text-lg leading-4 tracking-finnieSpacing-wide font-normal">
              {formatLongString(account.address, 22)}
            </span>
          </div>
          <div className="mt-3 text-sm font-normal" style={{ width: '418px' }}>
            Exporting your key will download a .JSON file. You can copy this file to multiple secure
            devices as a backup.{' '}
            <span className="font-semibold">Keep your keys somewhere safe and secret.</span>
          </div>

          <div style={{ width: '382px' }} className="pl-1.75 mt-3 font-semibold text-sm leading-6">
            Enter Finnie Password:
          </div>
          <div className="relative">
            <input
              style={{ width: '382px', height: '28px' }}
              type={showPassword ? 'text' : 'password'}
              className="text-base rounded-sm px-2 mt-1.5 bg-trueGray-400 bg-opacity-50 border-b border-indigo border-opacity-80"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            {!showPassword ? (
              <EyeIcon
                style={{ width: '29px', height: '18px' }}
                className="absolute top-2.5 right-2.5 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            ) : (
              <EyeIcon1
                style={{ width: '29px', height: '22px' }}
                className="absolute top-2 right-2.5 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            )}
          </div>

          {!isEmpty(passwordError) ? (
            <div
              style={{ width: '382px', height: '24px' }}
              className="pl-1.75 flex items-center mt-2 bg-warning rounded"
            >
              <NoticeIcon className="w-4.25" />
              <span className="ml-1.75">{passwordError}</span>
            </div>
          ) : (
            <div style={{ width: '382px', height: '24px' }} className="mt-2"></div>
          )}

          <Button
            className="h-10 mt-5 text-base rounded w-43.75 mx-auto"
            variant="indigo"
            text="Export Private Key"
            onClick={() => onExportKeyfile()}
          />
        </div>
      </div>
    </div>
  )
}

export default ExportPrivateKeyModal
