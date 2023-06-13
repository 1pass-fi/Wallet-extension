// modules
import React from 'react'
// assets
import BottomPattern from 'img/popup-onboarding-bottom-pattern.svg'
import FinnieLogo from 'img/popup-onboarding-fish-icon.svg'
import PlusIcon from 'img/popup-onboarding-plus-icon.svg'
import SeedIcon from 'img/popup-onboarding-seed-icon.svg'
import TopPattern from 'img/popup-onboarding-top-pattern.svg'

export default () => {
  const onClick = () => {
    const url = chrome.runtime.getURL('options.html#')
    chrome.tabs.create({ url })
  }


  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <div className='mb-9 z-10'><FinnieLogo /></div>
      <div className='text-blue-800 text-2xl font-normal text-center mb-2'>
        Welcome to the Finnie Wallet
      </div>
      <div className='text-blue-800 text-sm font-normal mb-9'>BY KOII NETWORK</div>
      <div onClick={onClick} style={{width:'366px',height:'60px'}} className='bg-blue-800 text-white rounded-lg flex justify-center items-center text-base font-semibold mb-9 cursor-pointer'>
        <PlusIcon />
        <div className='ml-5'>Get a New  Key</div>
      </div>

      <div onClick={onClick} style={{width:'366px',height:'60px',border:'2px solid #373765'}} className=' text-blue-800 rounded-lg flex justify-center items-center text-base font-semibold cursor-pointer z-10'>
        <SeedIcon />
        <div className='ml-5'>Import with a Secret Phrase</div>
      </div>

      <div className='absolute top-0 right-3 z-0 opacity-40'><TopPattern /></div>
      <div className='absolute bottom-0 left-2 z-0 opacity-40'><BottomPattern /></div>
    </div>
  )
}
