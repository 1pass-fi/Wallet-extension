import React, { useEffect, useMemo,useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setError } from 'actions/error'
import { setIsLoading } from 'actions/loading'
import { TYPE } from 'constants/accountConstants'
import Checked from 'img/wallet-connect/checked.svg'
import Rectangle from 'img/wallet-connect/rectangle.svg'
import Unchecked from 'img/wallet-connect/unchecked.svg'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as request } from 'services/request/popup'
import walletConnect from 'services/walletConnect'

const SelectAccountItem = ({ selectedAccounts, address, accountName, setSelectedAccounts }) => {
  const selected = useMemo(() => {
    return selectedAccounts.includes(address)
  }, [selectedAccounts])

  const toggleAccount = () => {
    if (!selectedAccounts.includes(address)) {
      setSelectedAccounts(prev => [address])
    } else {
      setSelectedAccounts(prev => prev.filter(_address => _address !== address))
    }
  }

  return (
    <div className='mt-2'>
      <div onClick={toggleAccount} className='flex cursor-pointer'>
        {selected ? <Checked /> : <Unchecked />}
        <div className='ml-3 text-indigo text-xs font-semibold'>{accountName}</div>
      </div>
      <div className='mt-3 text-success-700 text-xs'>{address}</div>
    </div>
  )
}

const Approval = ({ proposal }) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const [selectedAccounts, setSelectedAccounts] = useState([])
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    const loadAccounts = async () => {
      const type = metadata.namespace === 'eip155' ? TYPE.ETHEREUM : TYPE.SOLANA
      let accounts = await popupAccount.getAllMetadata(type)

      accounts = accounts.map(account => ({
        address: account?.address,
        accountName: account?.accountName
      }))

      setAccounts(accounts)
    }

    if (metadata.namespace) loadAccounts()
  }, [metadata])

  const metadata = useMemo(() => {
    if (!isEmpty(proposal)) {
      try {
        const origin = get(proposal, 'params.proposer.metadata.url')
        const namespace = Object.keys(get(proposal, 'params.requiredNamespaces', {}))[0]
        let methods = get(proposal, `params.requiredNamespaces[${namespace}].methods`, [])
        methods = methods.join(', ')
        let events = get(proposal, `params.requiredNamespaces[${namespace}].events`, [])
        events = events.join(', ')
  
        return { origin, namespace, methods, events }
      } catch (err) {
        console.error(err)
      }
    }

    return { origin: '---', namespace: '', methods: '', events: '' }
  }, [proposal])

  const handleApprove = async () => {
    try {
      dispatch(setIsLoading(true))
      if (isEmpty(selectedAccounts)) throw new Error('No selected account')
      let payload
      if (metadata.namespace === 'eip155') payload = { eip155: selectedAccounts }
      else payload = { solana: selectedAccounts }

      await walletConnect.approve(proposal, payload)
      await request.wallet.reloadWalletConnect()
      dispatch(setIsLoading(false))
      history.push('/')
    } catch (err) {
      dispatch(setIsLoading(false))
      dispatch(setError(err?.message))
      console.error(err)
    }
  }

  const handleReject = async () => {
    try {
      await walletConnect.reject(proposal)
      history.push('/')
    } catch (err) {
      dispatch(setError(err?.message))
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col w-full h-full p-7">
      <div className='pb-15'>
        {/* TITLE */}
        <div className='flex flex-col justify-center items-center'>
          <div className='color-indigo text-base font-semibold'>Session Proposal</div>
          <div style={{minWidth:'100px',height:'22px'}} className='flex justify-center items-center color-indigo font-semibold bg-turquoiseBlue rounded-sm mt-1 px-1'>{metadata.origin}</div>
        </div>

        {/* REVIEW PERMISSIONS */}
        <div className='mt-5'>
          <div className='color-indigo font-semibold'>Review {metadata.namespace} permissions:</div>
          <div className='mt-4 flex'>
            <div className='pt-1'><Rectangle /></div>
            <div style={{width:'317px'}} className='ml-3 color-indigo text-xs flex items-start'>Method: {metadata.methods}</div>
          </div>
          {metadata.events && <div className='mt-4 flex'>
            <div className='pt-1'><Rectangle /></div>
            <div style={{width:'317px'}} className='ml-3 color-indigo text-xs'>Events: {metadata.events}</div>
          </div>}
        </div>


        {/* SELECT ACCOUNTS */}
        <div className='mt-8'>
          <div className='color-indigo font-semibold'>Select wallet to connect:</div>
          {
            accounts.map((account, index) => 
              <SelectAccountItem 
                key={index}
                selectedAccounts={selectedAccounts}
                accountName={account.accountName}
                address={account.address}
                setSelectedAccounts={setSelectedAccounts}
              />)
          }
        </div>
      </div>

      {/* BUTTON */}
      <div style={{height:'42px'}} className='flex justify-between fixed bottom-16 bg-white'>
        <button onClick={handleReject} style={{width:'159px',height:'38px',border:'1.5px solid #373765'}} className='bg-white text-blue-800 text-base'>Cancel</button>
        <button onClick={handleApprove} style={{width:'159px',height:'38px'}} className='bg-blue-800 text-white text-base ml-13'>Approve</button>
      </div>
    </div>
  )
}

export default Approval
