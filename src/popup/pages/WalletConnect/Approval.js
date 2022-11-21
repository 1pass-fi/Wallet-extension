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
    console.log('selectedAccounts', selectedAccounts)
    return selectedAccounts.includes(address)
  }, [selectedAccounts])

  const toggleAccount = () => {
    if (!selectedAccounts.includes(address)) {
      setSelectedAccounts(prev => [...prev, address])
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
      let accounts = await popupAccount.getAllMetadata(TYPE.ETHEREUM)
      console.log('accounts', accounts)

      accounts = accounts.map(account => ({
        address: account?.address,
        accountName: account?.accountName
      }))

      setAccounts(accounts)
    }

    loadAccounts()
  }, [])

  const metadata = useMemo(() => {
    console.log('proposal', proposal)
    if (!isEmpty(proposal)) {
      const origin = get(proposal, 'params.proposer.metadata.url')

      return { origin }
    }

    return { origin: '---' }
  }, [proposal])

  const handleApprove = async () => {
    try {
      dispatch(setIsLoading(true))
      if (isEmpty(selectedAccounts)) throw new Error('No selected account')
      await walletConnect.approve(proposal, { eip155: selectedAccounts })
      setTimeout(() => {
        request.wallet.reloadWalletConnect()
      }, 3000)
      dispatch(setIsLoading(false))
      history.push('/')
    } catch (err) {
      dispatch(setIsLoading(false))
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
          <div className='color-indigo font-semibold'>Review eip155 permissions:</div>
          <div className='mt-4 flex'>
            <div className='pt-1'><Rectangle /></div>
            <div style={{width:'317px'}} className='ml-3 color-indigo text-xs flex items-start'>Method: eth_sendTransaction, eth_signTransaction, eth_sign, personal_sign, eth_signTypedData</div>
          </div>
          <div className='mt-4 flex'>
            <div className='pt-1'><Rectangle /></div>
            <div style={{width:'317px'}} className='ml-3 color-indigo text-xs'>Events: chainChanged, accountsChanged</div>
          </div>
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
        <button style={{width:'159px',height:'38px',border:'1.5px solid #373765'}} className='bg-white text-blue-800 text-base'>Cancel</button>
        <button onClick={handleApprove} style={{width:'159px',height:'38px'}} className='bg-blue-800 text-white text-base ml-13'>Approve</button>
      </div>
    </div>
  )
}

export default Approval
