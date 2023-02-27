// modules
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { TYPE } from 'constants/accountConstants'
import { MESSAGES } from 'constants/koiConstants'
// assets
import CloseIcon from 'img/v2/close-icon-blue.svg'
import EmptyConnectedSitesIcon from 'img/v2/empty-connected-sites-icon.svg'
import RecycleBinIcon from 'img/v2/recycle-bin-icon.svg'
import capitalize from 'lodash/capitalize'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
// actions
import { loadAllAccounts } from 'options/actions/accounts'
import { setIsLoading, setLoaded } from 'options/actions/loading'
// constants
import { GalleryContext } from 'options/galleryContext'
import formatLongString from 'options/utils/formatLongString'
// services
import storage from 'services/storage'
// utils
import { getSiteConnectedAddresses } from 'utils'

const ConnectedSitesModal = ({ account, close }) => {
  const { setError } = useContext(GalleryContext)
  const [siteConnectedAddresses, setSiteConnectedAddresses] = useState([])
  const modalRef = useRef(null)

  const dispatch = useDispatch()

  const loadConnectedSites = async () => {
    try {
      dispatch(setIsLoading)

      const siteAddresses = await getSiteConnectedAddresses(account.address, account.type)

      setSiteConnectedAddresses(siteAddresses)
      dispatch(setLoaded)
    } catch (error) {
      setError(error.message)
      console.log('Load connected sites - Error: ', error.message)
      dispatch(setLoaded)
    }
  }

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

  useEffect(() => {
    loadConnectedSites()
  }, [])

  const handleRemoveSite = async (siteAddress) => {
    try {
      dispatch(setIsLoading)
      let siteConnectedStorage = await storage.setting.get.siteConnectedAddresses()
      if (isEmpty(siteConnectedStorage[siteAddress.address])) {
        return
      }

      if (account.type === TYPE.ARWEAVE) {
        let connectedArweaveAddresses = get(
          siteConnectedStorage[siteAddress.address],
          'arweave',
          []
        )
        connectedArweaveAddresses = connectedArweaveAddresses.filter(
          (address) => address !== account.address
        )

        siteConnectedStorage[siteAddress.address].arweave = connectedArweaveAddresses
      }

      if (account.type === TYPE.ETHEREUM) {
        let connectedEthereumAddresses = get(
          siteConnectedStorage[siteAddress.address],
          'ethereum',
          []
        )
        connectedEthereumAddresses = connectedEthereumAddresses.filter(
          (address) => address !== account.address
        )

        siteConnectedStorage[siteAddress.address].ethereum = connectedEthereumAddresses
      }

      if (account.type === TYPE.SOLANA) {
        let connectedSolanaAddress = get(siteConnectedStorage[siteAddress.address], 'solana', [])
        connectedSolanaAddress = connectedSolanaAddress.filter(
          (address) => address !== account.address
        )

        siteConnectedStorage[siteAddress.address].solana = connectedSolanaAddress
      }

      if (account.type === TYPE.K2) {
        let connectK2Addresses = get(siteConnectedStorage[siteAddress.address], 'k2', [])
        connectK2Addresses = connectK2Addresses.filter((address) => address !== account.address)

        siteConnectedStorage[siteAddress.address].k2 = connectK2Addresses
      }

      await storage.setting.set.siteConnectedAddresses(siteConnectedStorage)

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.ACCOUNTS_CHANGED })
      })

      // update account state
      await dispatch(loadAllAccounts())

      loadConnectedSites()
    } catch (error) {
      setError(error.message)
      console.log('Remove connected site - Error: ', error.message)
    } finally {
      dispatch(setLoaded)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-screen bg-black bg-opacity-25 fixed z-51 top-0 left-0">
      <div
        style={{ width: '586px', minHeight: '300px' }}
        className="rounded bg-trueGray-100 flex flex-col items-center text-indigo"
        ref={modalRef}
      >
        <div className="flex h-16.75 rounded-t bg-trueGray-100 shadow-md w-full font-semibold text-xl tracking-finnieSpacing-wide relative">
          {/* <BackIcon onClick={close} className="w-7 h-7 top-4 left-4 absolute cursor-pointer" /> */}
          <div className="m-auto">{chrome.i18n.getMessage('connectedSites')}</div>
          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>
        {isEmpty(siteConnectedAddresses) ? (
          <div className="m-auto flex flex-col items-center">
            <EmptyConnectedSitesIcon />
            <div className="font-normal text-base leading-6 text-center text-indigo">
              {chrome.i18n.getMessage('notConnectedToAnySites')}
            </div>
          </div>
        ) : (
          <>
            <div className="mt-7.5 font-normal text-base text-center tracking-finnieSpacing-wide text-indigo">
              <span className="font-semibold">{formatLongString(account.accountName, 20)}</span>
              {' '}{chrome.i18n.getMessage('isConnectedToSites')}
            </div>
            <div
              className="w-11/12 mt-4.5 mb-15 flex flex-col justify-between text-blue-850 overflow-y-scroll"
              style={{ maxHeight: '240px' }}
            >
              {siteConnectedAddresses.map((siteAddress, idx) => (
                <div
                  className="flex justify-between items-center mb-2 relative mx-auto"
                  style={{ width: '480px' }}
                  key={idx}
                >
                  <div style={{ maxWidth: '380px' }}>
                    <div className="font-semibold text-sm leading-6 tracking-finnieSpacing-wide truncate">
                      {siteAddress.origin}
                    </div>
                    <div className="font-normal text-sm leading-6 tracking-finnieSpacing-wide truncate">
                      {siteAddress.address}
                    </div>
                  </div>
                  <div
                    className="absolute bottom-2.5 right-0 flex items-center justify-center bg-warning-300 rounded-full shadow cursor-pointer"
                    onClick={() => handleRemoveSite(siteAddress)}
                    style={{ width: '30px', height: '30px' }}
                  >
                    <RecycleBinIcon style={{ width: '18px', height: '22px' }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ConnectedSitesModal
