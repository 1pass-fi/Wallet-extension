import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setIsLoading } from 'actions/loading'
import GlobeIcon from 'img/wallet-connect/globe-big-icon.svg'
import walletConnect from 'services/walletConnect'

const InputUri = ({ setPage, setProposal }) => {
  const dispatch = useDispatch()
  const [uri, setUri] = useState('')

  const handleConnect = async () => {
    dispatch(setIsLoading(true))
    await walletConnect.init()
    walletConnect.signClient.on('session_proposal', (proposal) => {
      setProposal(proposal)
    })
    await walletConnect.pair(uri)
    dispatch(setIsLoading(false))
    setPage('APPROVAL')
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <GlobeIcon />
      <div className=' mt-5 mb-7 text-indigo text-base font-semibold'>Wallet Connect</div>
      <div>
        <div style={{height:'24px'}} className='flex items-center text-indigo text-sm'>Enter wallet connect URL</div>
        <input onChange={e => setUri(e.target.value)} style={{width:'360px',height:'36px'}} className='mt-1 bg-purplelight-100 color-purplelight-100 pl-4 rounded-md' placeholder='URI'/>
      </div>
      <button onClick={handleConnect} style={{width:'160px',height:'38px'}} className='bg-blue-800 text-white text-base mt-7'>Connect</button>
    </div>
  )
}

export default InputUri
