// modules
import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
// actions
import { setError } from 'actions/error'
import { setIsLoading } from 'actions/loading'
// constants
import { TYPE } from 'constants/accountConstants'
import { MESSAGES } from 'constants/koiConstants'
import RecycleBinIcon from 'img/popup/recycle-bin-icon.svg'
// assets
import CloseIcon from 'img/v2/close-icon-white.svg'
import EmptyConnectedSitesIcon from 'img/v2/empty-connected-sites-icon.svg'
import capitalize from 'lodash/capitalize'
import find from 'lodash/find'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
// selectors
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'
// services
import storage from 'services/storage'
// utils
import { getSiteConnectedAddresses } from 'utils'

const ConnectedSitesModal = ({ onClose, setError, setIsLoading }) => {
  const [siteConnectedAddresses, setSiteConnectedAddresses] = useState([])
  const displayingAccount = useSelector(getDisplayingAccount)

  const loadConnectedSites = async () => {
    try {
      setIsLoading(true)

      const siteAddresses = await getSiteConnectedAddresses(
        displayingAccount.address,
        displayingAccount.type
      )

      setSiteConnectedAddresses(siteAddresses)
      setIsLoading(false)
    } catch (error) {
      setError(error.message)
      console.log('Load connected sites - Error: ', error.message)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadConnectedSites()
  }, [])

  const handleRemoveSite = async (siteAddress) => {
    try {
      setIsLoading(true)
      let siteConnectedStorage = await storage.setting.get.siteConnectedAddresses()
      if (isEmpty(siteConnectedStorage[siteAddress.address])) {
        setIsLoading(false)
        return
      }

      if (displayingAccount.type === TYPE.ARWEAVE) {
        let connectedArweaveAddresses = get(
          siteConnectedStorage[siteAddress.address],
          'arweave',
          []
        )
        connectedArweaveAddresses = connectedArweaveAddresses.filter(
          (address) => address !== displayingAccount.address
        )

        siteConnectedStorage[siteAddress.address].arweave = connectedArweaveAddresses
      }

      if (displayingAccount.type === TYPE.ETHEREUM) {
        let connectedEthereumAddresses = get(
          siteConnectedStorage[siteAddress.address],
          'ethereum',
          []
        )
        connectedEthereumAddresses = connectedEthereumAddresses.filter(
          (address) => address !== displayingAccount.address
        )

        siteConnectedStorage[siteAddress.address].ethereum = connectedEthereumAddresses
      }

      if (displayingAccount.type === TYPE.SOLANA) {
        let connectedSolanaAddresses = get(siteConnectedStorage[siteAddress.address], 'solana', [])
        connectedSolanaAddresses = connectedSolanaAddresses.filter(
          (address) => address !== displayingAccount.address
        )

        siteConnectedStorage[siteAddress.address].solana = connectedSolanaAddresses
      }

      if (displayingAccount.type === TYPE.K2) {
        let conectedK2Addresses = get(siteConnectedStorage[siteAddress.address], 'k2', [])
        conectedK2Addresses = conectedK2Addresses.filter(
          (address) => address !== displayingAccount.address
        )

        siteConnectedStorage[siteAddress.address].k2 = conectedK2Addresses
      }

      await storage.setting.set.siteConnectedAddresses(siteConnectedStorage)

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.ACCOUNTS_CHANGED })
      })

      setIsLoading(false)
      loadConnectedSites()
    } catch (error) {
      setError(error.message)
      console.log('Remove connected site - Error: ', error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-full z-51 m-auto top-0 left-0 fixed flex flex-col items-center">
      <div
        className="relative bg-white shadow-md rounded m-auto flex flex-col items-center overflow-y-scroll"
        style={{ width: '381px', height: '390px' }}
      >
        <div
          className="relative bg-blue-800 w-full flex items-center justify-center"
          style={{ height: '67px' }}
        >
          <div className="font-semibold text-xl text-white leading-6 text-center tracking-finnieSpacing-wide">
            {chrome.i18n.getMessage('connectedSites')}
          </div>
          <CloseIcon
            style={{ width: '30px', height: '30px' }}
            className="absolute top-4 right-4 cursor-pointer"
            onClick={onClose}
          />
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
            <div className="mt-4.5 font-normal text-base text-center tracking-finnieSpacing-wide text-indigo">
              <span className="font-semibold">{displayingAccount.accountName}</span> is connected to
              {chrome.i18n.getMessage('theseSitesLc')}.
            </div>
            <div
              className="w-full mt-7.5 flex flex-col justify-between pl-6.5 text-blue-850 overflow-y-scroll"
              style={{ maxHeight: '240px' }}
            >
              {siteConnectedAddresses.map((siteAddress, idx) => (
                <div className="w-full flex justify-between items-center pr-8 mb-2" key={idx}>
                  <div style={{ maxWidth: '269px' }}>
                    <div className="font-semibold text-xs tracking-finnieSpacing-wide truncate">
                      {siteAddress.origin}
                    </div>
                    <div className="font-normal text-2xs leading-6 tracking-finnieSpacing-wide truncate">
                      {siteAddress.address}
                    </div>
                  </div>
                  <RecycleBinIcon
                    className="cursor-pointer"
                    onClick={() => handleRemoveSite(siteAddress)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default connect(null, { setError, setIsLoading })(ConnectedSitesModal)
