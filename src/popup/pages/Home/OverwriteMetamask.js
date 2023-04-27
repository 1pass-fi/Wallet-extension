import React, { useEffect, useState } from 'react'
import BackgroundPatternLeft from 'img/background-pattern-left.svg'
import BackgroundPatternRight from 'img/background-pattern-right.svg'
import get from 'lodash/get'
import storage from 'services/storage'
import getCurrentTab from 'utils/getCurrentTab'

const isValidUrl = (url) => {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/
  return urlRegex.test(url)
}

const OverwriteMetamask = () => {
  const [shouldAskForMetamaskOverwrite, setShouldAskForMetamaskOverwrite] = useState(false)

  useEffect(() => {
    const load = async () => {
      const currentTab = await getCurrentTab()
      const origin = get(currentTab, 'url')
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
      const origin = get(currentTab, 'url')
      const payload = {
        shouldOverwriteMetamask: isApproved,
        title: get(currentTab, 'title', '')
      }

      const overwriteMetamaskSites = await storage.setting.get.overwriteMetamaskSites()
      if (origin) overwriteMetamaskSites[origin] = payload
  
      await storage.setting.set.overwriteMetamaskSites(overwriteMetamaskSites)
      setShouldAskForMetamaskOverwrite(false)
    } catch (err) {
      console.error(err)
    }
  }

  return shouldAskForMetamaskOverwrite ? (
    <div style={{ height:'482px', top:'54px' }} className='w-full fixed right-0 z-51 bg-white justify-start content-center'>
      <div className='w-full h-full justify-center items-center flex text-center'>
        <div style={{width:'278px', height:'168px'}} className='flex flex-col justify-between'>
          <div className='text-indigo font-semibold text-base'>
            {chrome.i18n.getMessage('finnieJustDetectedMetamask')}
          </div>
          <div>
            {chrome.i18n.getMessage('wouldYouLikeToOverwrite')}
          </div>
          <div>
            {chrome.i18n.getMessage('ifYouWantToChangeThisSetting')}
          </div>
        </div>
        <div style={{bottom:'72px'}} className='fixed w-full top-'>
          <div className='flex justify-between px-4'>
            <button 
              style={{width:'190px',height:'38px'}} 
              className='text-blue-800 text-base bg-white border-1.5 border-blue-800 rounded-sm'
              onClick={() => handleOverwriteMetamask(false)}
            >
              {chrome.i18n.getMessage('keepMetamask')}
            </button>
            <button 
              style={{width:'190px',height:'38px'}} 
              className='text-white text-base bg-blue-800 rounded-sm'
              onClick={() => handleOverwriteMetamask(true)}
            >
              {chrome.i18n.getMessage('connect')}
            </button>
          </div>
        </div>
      </div>
      <div className='absolute top-0'>
        <BackgroundPatternLeft />
      </div>
      <div className='absolute top-0 right-0'>
        <BackgroundPatternRight />
      </div>
    </div>
  ) : ''
}

export default OverwriteMetamask
