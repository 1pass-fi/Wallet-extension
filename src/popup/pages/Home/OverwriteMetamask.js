import React, { useEffect, useState } from 'react'
import get from 'lodash/get'
import storage from 'services/storage'
import getCurrentTab from 'utils/getCurrentTab'

import ConnectMmToast from './ConnectMmToast'

function getOriginFromUrl(url) {
  const regex = /^(https?:\/\/[^/]+)/i
  const match = url.match(regex)
  return match ? match[1] : null
}

const isValidUrl = (url) => {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/
  return urlRegex.test(url)
}

const OverwriteMetamask = () => {
  const [shouldAskForMetamaskOverwrite, setShouldAskForMetamaskOverwrite] = useState(false)

  const [showToast, setShowToast] = useState(false)
  const [timer, setTimer] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const load = async () => {
      const currentTab = await getCurrentTab()
      const origin = getOriginFromUrl(get(currentTab, 'url'))
      if (!isValidUrl(origin)) return

      const hasMetamaskInstalled = await chrome.runtime.sendMessage('checkMetamask')
      const overwriteMetamaskSites = await storage.setting.get.overwriteMetamaskSites()
      const shouldOverwriteMetamask = get(overwriteMetamaskSites, [origin, 'shouldOverwriteMetamask'], false)

      setShouldAskForMetamaskOverwrite(hasMetamaskInstalled && !shouldOverwriteMetamask)
    }

    load()
  }, [])

  const handleOverwriteMetamask = async (isApproved) => {
    try {
      const currentTab = await getCurrentTab()
      const origin = getOriginFromUrl(get(currentTab, 'url'))
      const payload = {
        shouldOverwriteMetamask: isApproved,
        title: get(currentTab, 'title', '')
      }

      const overwriteMetamaskSites = await storage.setting.get.overwriteMetamaskSites()
      if (origin) overwriteMetamaskSites[origin] = payload
  
      await storage.setting.set.overwriteMetamaskSites(overwriteMetamaskSites)
      setConnected(true)
    } catch (err) {
      console.error(err)
    }
  }

  return shouldAskForMetamaskOverwrite ? (
    <ConnectMmToast 
      showToast={showToast}
      setShowToast={setShowToast}
      timer={timer}
      setTimer={setTimer}
      connected={connected}
      setConnected={setConnected}
      handleOverwriteMetamask={handleOverwriteMetamask}
    />
  ) : ''
}

export default OverwriteMetamask
