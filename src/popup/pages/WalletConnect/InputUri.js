import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setIsLoading } from 'actions/loading'
import BackIcon from 'img/wallet-connect/back-icon.svg'
import BackgroundLeft from 'img/wallet-connect/bg-left.svg'
import BackgroundRight from 'img/wallet-connect/bg-right.svg'
import GlobeIcon from 'img/wallet-connect/globe-big-icon.svg'
import get from 'lodash/get'
import { setError } from 'popup/actions/error'
import walletConnect from 'services/walletConnect'

const ERROR_MESSAGE = {
  INVALID_PROPOSAL: 'Invalid request',
  WENT_WRONG: 'Something went wrong'
}

const InputUri = ({ setPage, setProposal }) => {
  const history = useHistory()

  const dispatch = useDispatch()
  const [uri, setUri] = useState('')

  const validateProposal = (proposal) => {
    try {
      const validChains = [
        'eip155:1',
        'eip155:5',
        'solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K',
        'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ'
      ]

      const namespaces = get(proposal, 'params.requiredNamespaces')
      let chains = []
      Object.keys(namespaces).forEach((chainName) => {
        const _chains = namespaces[chainName]?.chains || []
        chains = [...chains, ..._chains]
      })

      return chains.every((chain) => validChains.includes(chain)) && chains?.length === 1
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const handleConnect = async () => {
    try {
      dispatch(setIsLoading(true))
      await walletConnect.init()
      walletConnect.signClient.on('session_proposal', (proposal) => {
        setProposal(proposal)
        const isValidProposal = validateProposal(proposal)
        if (isValidProposal) {
          setPage('APPROVAL')
        } else {
          dispatch(setError(ERROR_MESSAGE.INVALID_PROPOSAL))
        }
      })
      await walletConnect.pair(uri)
    } catch (err) {
      dispatch(setError(err?.message))
    }
    dispatch(setIsLoading(false))
  }

  const handleGoBack = () => {
    history.push('/')
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <BackgroundLeft className="fixed top-0 left-0" />
      <BackgroundRight className="fixed top-0 right-0" />
      <div onClick={handleGoBack} className="fixed top-16 left-3 cursor-pointer">
        <BackIcon />
      </div>
      <GlobeIcon />
      <div className="mt-5 mb-7 text-indigo text-base font-semibold">Wallet Connect</div>
      <div>
        <div style={{ height: '24px' }} className="flex items-center text-indigo text-sm">
          Enter wallet connect URL
        </div>
        <input
          onChange={(e) => setUri(e.target.value)}
          style={{ width: '360px', height: '36px' }}
          className="mt-1 bg-purplelight-100 color-purplelight-100 pl-4 rounded-md"
          placeholder="Type here"
        />
      </div>
      <button
        onClick={handleConnect}
        style={{ width: '160px', height: '38px' }}
        className="bg-blue-800 text-white text-base mt-7 rounded-sm"
      >
        Connect
      </button>
    </div>
  )
}

export default InputUri
