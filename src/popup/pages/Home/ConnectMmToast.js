import React, { useEffect, useState } from 'react'
import LittleCheckIcon from 'img/little-check-icon.svg'
import LittleCloseIcon from 'img/little-close-icon.svg'

import './ConnectMmToast.css'

const ConnectMmToast = ({ showToast, setShowToast, timer, setTimer, connected, setConnected, handleOverwriteMetamask }) => {
  useEffect(() => {
    setTimeout(() => {
      setShowToast(true)
    }, 300)

    setTimer(setTimeout(() => {
      setShowToast(false)
    }, 5000))

    return () => clearTimeout(timer)
  }, [])

  const handleMouseEnter = () => {
    clearTimeout(timer)
  }

  const handleMouseLeave = () => {
    setTimer(setTimeout(() => {
      setShowToast(false)
    }, 2000))
  }

  return (
    <div
      className={`toast ${showToast ? 'toast-slide-in toast-show' : ''} ${connected && 'toast-connected'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!connected && <div className='flex justify-center items-center text-sm'>
        Use Finnie on this site?&nbsp;<span onClick={() => handleOverwriteMetamask(true)} className='underline font-semibold cursor-pointer'>Connect</span>
        <div className='ml-1 cursor-pointer' onClick={() => setShowToast(false)}><LittleCloseIcon /></div>
      </div>}
      {connected && <div className='flex justify-center items-center text-sm'>
        <div className='mr-1'><LittleCheckIcon /></div>
        <div>Manage connected sites.&nbsp;<span onClick={() => {
          const url = chrome.runtime.getURL('options.html#/settings/wallet')
          chrome.tabs.create({ url })
        }} className='underline cursor-pointer font-semibold'>Settings</span></div>
      </div>}
    </div>
  )
}

export default ConnectMmToast
