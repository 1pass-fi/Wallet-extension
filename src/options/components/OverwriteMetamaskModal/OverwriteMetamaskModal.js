// modules
import React, { useEffect, useRef, useState } from 'react'
import FinnieIcon from 'img/overwritemm-finnie-icon.svg'
import MetamaskIcon from 'img/overwritemm-metamask-icon.svg'
// assets
import CloseIcon from 'img/v2/close-icon-blue.svg'
import EmptyConnectedSitesIcon from 'img/v2/empty-connected-sites-icon.svg'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
// constants
import storage from 'services/storage'

import ToggleButton from './ToggleButton'

const SiteItem = ({ site }) => {
  const [shouldOverwriteMetamask, setShouldOverwriteMetamask] = useState(get(site, 'shouldOverwriteMetamask', false))

  const setValue = async (value) => {
    setShouldOverwriteMetamask(value)
    const overwriteMetamaskSites = await storage.setting.get.overwriteMetamaskSites()
    const payload = overwriteMetamaskSites[site?.origin]
    if (!isEmpty(payload)) {
      payload.shouldOverwriteMetamask = value
      overwriteMetamaskSites[site?.origin] = payload
      await storage.setting.set.overwriteMetamaskSites(overwriteMetamaskSites)
    } 
  }

  return (
    <div
      className="flex justify-between items-center mb-2 relative mx-auto"
      style={{ width: '480px' }}
    >
      <div style={{ maxWidth: '380px' }}>
        <div className="font-semibold text-sm leading-6 tracking-finnieSpacing-wide truncate">
          {get(site, 'title')}
        </div>
        <div className="font-normal text-sm leading-6 tracking-finnieSpacing-wide truncate">
          {get(site, 'origin')}
        </div>
      </div>
      <div className='flex justify-between items-center w-36'>
        <FinnieIcon />
        <ToggleButton value={shouldOverwriteMetamask} setValue={setValue}/>
        <MetamaskIcon />
      </div>
    </div>
  )
}

const OverwriteMetamaskModal = ({ close }) => {
  const [overwriteMetamaskSites, setOverwriteMetamaskSites] = useState([])
  const modalRef = useRef(null)

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
    const loadOverwriteMetamaskSites = async () => {
      try {
        let overwriteMetamaskSites = await storage.setting.get.overwriteMetamaskSites()
        overwriteMetamaskSites = Object.entries(overwriteMetamaskSites).map(site => {
          return {
            origin: site[0],
            shouldOverwriteMetamask: get(site, '[1].shouldOverwriteMetamask', false),
            title: get(site, '[1].title', '')
          }
        })
        setOverwriteMetamaskSites(overwriteMetamaskSites)
      } catch (err) {
        console.error(err)
      }
    }

    loadOverwriteMetamaskSites()
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-screen bg-black bg-opacity-25 fixed z-51 top-0 left-0">
      <div
        style={{ width: '586px', minHeight: '300px' }}
        className="rounded bg-trueGray-100 flex flex-col items-center text-indigo"
        ref={modalRef}
      >
        <div className="flex h-16.75 rounded-t bg-trueGray-100 shadow-md w-full font-semibold text-xl tracking-finnieSpacing-wide relative">
          <div className="m-auto">{chrome.i18n.getMessage('metamaskOverwrites')}</div>
          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>
        <div className='mt-7 text-base text-indigo'>
          {chrome.i18n.getMessage('selectWhichWalletToConnect')}
        </div>
        {isEmpty(overwriteMetamaskSites) ? (
          <div className="m-auto flex flex-col items-center">
            <EmptyConnectedSitesIcon />
            <div className="font-normal text-base leading-6 text-center text-indigo">
              {chrome.i18n.getMessage('notConnectedToAnySites')}
            </div>
          </div>
        ) : (
          <>
            <div
              className="w-11/12 mt-4.5 mb-15 flex flex-col justify-between text-blue-850 overflow-y-scroll"
              style={{ maxHeight: '240px' }}
            >
              {overwriteMetamaskSites.map((site, idx) => 
                <div key={idx}>
                  <SiteItem 
                    overwriteMetamaskSites={overwriteMetamaskSites}
                    setOverwriteMetamaskSites={setOverwriteMetamaskSites}
                    site={site}/>
                </div>)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OverwriteMetamaskModal
