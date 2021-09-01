import React, { useState, useRef, useEffect, useContext } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { CSVLink } from 'react-csv'

import CloseIcon from 'img/close-x-icon.svg'
import { popupBackgroundRequest as backgroundRequest } from 'services/request'
import { GalleryContext } from 'options/galleryContext'
import { getChromeStorage, decryptSeedPhraseFromChrome } from 'utils'
import './index.css'

export const ExportBackupPhraseModal = ({ account, closeModal }) => {
  const { setError } = useContext(GalleryContext)

  const { name, address } = account
  const [password, setPassword] = useState('')
  const [isRevealed, setIsRevealed] = useState(false)
  const [seedPhrase, setSeedPhrase] = useState('')
  const ref = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeModal()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

  const onRevealSeedphrase = async () => {
    try {
      const seedPhrase = await decryptSeedPhraseFromChrome(password)
      setSeedPhrase(seedPhrase)
      setIsRevealed(true)

    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className='export-phrase-modal-wrapper'>
      <div className='export-phrase-modal' ref={ref}>
        <div className='title'>Backup Phrase</div>
        <div className='account-info'>
          <div className='account-name'>{name}</div>
          <div className='account-address'>{address}</div>
        </div>

        {!isRevealed && (
          <>
            <div className='description'>
              If you change your browser or switch computers, you will need this
              Backup Phrase to access your account.
            </div>
            <div className='tip'>Keep it somewhere safe and secret.</div>
          </>
        )}

        <div className='warning'>
          <div className='warning-title'>Never share your backup phrase.</div>
          <div className='warning-description'>
            Anyone with this phrase can steal from your wallet.
          </div>
        </div>

        {isRevealed ? (
          <div className='seed-phrase'>
            <label className='label'>Backup Phrase</label>
            <div className='textarea'>{seedPhrase}</div>
            <div className='button-line'>
              <CopyToClipboard text={seedPhrase}>
                <div className='copy-phrase-button'>Copy Phrase</div>
              </CopyToClipboard>
              <CSVLink
                filename={`${name}_seedphrase.csv`}
                data={seedPhrase}
                style={{ textDecoration: 'none' }}
              >
                <div className='save-csv-button'>Save as CSV File</div>
              </CSVLink>
            </div>
          </div>
        ) : (
          <div className='enter-password'>
            <label className='label'>Enter Finnie Password</label>
            <input
              type='password'
              className='input'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className='button-line'>
              <div
                className='reveal-phrase-button'
                onClick={onRevealSeedphrase}
              >
                Reveal Phrase
              </div>
              <div className='go-back-button' onClick={closeModal}>
                Go Back
              </div>
            </div>
          </div>
        )}

        <div className='close-button' onClick={closeModal}>
          <CloseIcon />
        </div>
      </div>
    </div>
  )
}

export const ExportBackupKeyFileModal = ({ account, closeModal }) => {
  const { setError } = useContext(GalleryContext)

  const { name, address, seedPhrase } = account
  const [password, setPassword] = useState('')

  const ref = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeModal()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

  const onExportKeyfile = async () => {
    try {
      const { key } = await backgroundRequest.gallery.getKeyFile({ password })
      const filename = 'arweave-key.json'
      const result = JSON.stringify(key)
  
      const url = 'data:application/json;base64,' + btoa(result)
      chrome.downloads.download({
        url: url,
        filename: filename,
      })
      closeModal()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className='export-phrase-modal-wrapper'>
      <div className='export-phrase-modal' ref={ref}>
        <div className='title'>Backup Keyfile</div>
        <div className='account-info'>
          <div className='account-name'>{name}</div>
          <div className='account-address'>{address}</div>
        </div>

        <div className='description'>
          Exporting your key will start downloading a .JSON file. You can copy
          it to multiple secure devices as a backup.
        </div>

        <div className='tip'>Keep your keys somewhere safe and secret.</div>

        <div className='warning'>
          <div className='warning-title'>Never share your private key.</div>
          <div className='warning-description'>
            Anyone with this phrase can steal from your wallet.
          </div>
        </div>
        <div className='enter-password'>
          <label className='label'>Enter Finnie Password</label>
          <input
            type='password'
            className='input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className='button-line'>
            <div className='reveal-phrase-button' onClick={onExportKeyfile}>
              Download Key
            </div>
            <div className='go-back-button' onClick={closeModal}>
              Go Back
            </div>
          </div>
        </div>
        <div className='close-button' onClick={closeModal}>
          <CloseIcon />
        </div>
      </div>
    </div>
  )
}
