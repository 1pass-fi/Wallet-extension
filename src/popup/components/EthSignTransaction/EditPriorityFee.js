import React, { useEffect, useMemo, useRef,useState } from 'react'
import clsx from 'clsx'
import { ethers } from 'ethers'
import DropDownIcon from 'img/dropdown-icon.svg'
import ForkIcon from 'img/fork-icon.svg'
import SelectedCircle from 'img/selected-circle.svg'
import UnselectedCircle from 'img/unselected-circle.svg'
import { formatNumber } from 'options/utils'
import storage from 'services/storage'
import ethereumUtils from 'utils/ethereumUtils'

import { TAB } from './hooks/constants'

const LOW = '1'
const MEDIUM = '2.5'
const HIGH = '5'
const MAX_FEE_TOO_LOW = 'Gas fee is too low'

const EditPriorityFee = ({
  gasLimit, 
  maxPriorityFeePerGas, 
  maxFeePerGas, 
  isFixedMaxFeePerGas, 
  baseFee,
  setMaxPriorityFeePerGas,
  setMaxFeePerGas,
  setIsFixedMaxFeePerGas,
  setTab
}) => {
  const [feeLevel, setFeeLevel] = useState(MEDIUM)
  const [tempMaxFeePerGas, setTempMaxFeePerGas] = useState(0)
  const [tempIsFixedMaxFeePerGas, setTempIsFixedMaxFeePerGas] = useState(false)
  const [tempMaxPriorityFee, setTempMaxPriorityFee] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [showAdvancedInput, setShowAdvancedInput] = useState(false)

  const [priorityFeeErrorMessage, setPriorityFeeErrorMessage] = useState('')
  const [maxFeeErrorMessage, setMaxFeeErrorMessage] = useState('')  

  const expressSetFee = (level) => {
    setTempIsFixedMaxFeePerGas(false)
    setFeeLevel(level)
    const tempMaxPriorityFeeInWei = ethers.utils.parseUnits(level, 'gwei').toNumber()
    setTempMaxPriorityFee(tempMaxPriorityFeeInWei)
    setMaxFeeErrorMessage('')
  }
  
  const predictMaxFee = useMemo(() => {
    if (!baseFee || !gasLimit) return '------'
    if (tempIsFixedMaxFeePerGas) {
      return (tempMaxFeePerGas * gasLimit) / Math.pow(10, 18)
    } else {
      return ((tempMaxPriorityFee + baseFee * 2) * gasLimit) / Math.pow(10, 18)
    }
  }, [tempIsFixedMaxFeePerGas, tempMaxFeePerGas, tempMaxPriorityFee, gasLimit, baseFee])
  
  const predictEstimatedFee = useMemo(() => {
    if (!baseFee || !gasLimit) return '------'
    return ((tempMaxPriorityFee + baseFee) * gasLimit) / Math.pow(10, 18)
  }, [tempMaxPriorityFee, baseFee, gasLimit])

  const tempMaxPriorityInGwei = useMemo(() => {
    return tempMaxPriorityFee / Math.pow(10, 9)
  }, [tempMaxPriorityFee])
  
  useEffect(() => {
    const initTemp = () => {
      setTempIsFixedMaxFeePerGas(isFixedMaxFeePerGas)
      setTempMaxFeePerGas(maxFeePerGas)
      setTempMaxPriorityFee(maxPriorityFeePerGas)

      switch ((maxPriorityFeePerGas / Math.pow(10, 9)).toString()) {
        case LOW: 
          setFeeLevel(LOW)
          break
        case MEDIUM:
          setFeeLevel(MEDIUM)
          break
        case HIGH:
          setFeeLevel(HIGH)
          break
        default:
          setFeeLevel(null)
      }
      setLoaded(true)
    }
    initTemp()
  }, [])

  useEffect(() => {
    if (loaded) {
      if (!tempIsFixedMaxFeePerGas) setTempMaxFeePerGas(tempMaxPriorityFee + baseFee * 2)
    }
  }, [tempIsFixedMaxFeePerGas, tempMaxPriorityFee, baseFee, loaded])

  const validateFee = () => {
    if (tempMaxFeePerGas < (baseFee + tempMaxPriorityFee)) {
      setMaxFeeErrorMessage(MAX_FEE_TOO_LOW)
      return false
    }

    return true
  }

  const handleSave = async () => {
    if(!validateFee()) return
    setMaxPriorityFeePerGas(tempMaxPriorityFee)
    setTimeout(() => {
      setMaxFeePerGas(tempMaxFeePerGas)
    }, 1000)
    setIsFixedMaxFeePerGas(tempIsFixedMaxFeePerGas)
    setTab(TAB.DETAIL)
  }

  return (
    <div className="flex flex-col items-center w-full overflow mt-2 text-indigo">
      {/* <div
        className="flex bg-trueGray-100 text-lg border-1.5 text-blue-800 font-extrabold justify-center items-center"
        style={{ width: '426px', height: '45px' }}
      >
        UNTITLED
      </div> */}
      <div
        className="flex text-blue-800 mt-4 justify-center items-center"
        style={{ width: '243px', height: '46px', fontSize: '35px' }}
      >
        {formatNumber(predictEstimatedFee, 8)}
      </div>
      <div
        className="flex text-xl text-blue-800 font-semibold justify-center items-center mt-3"
        style={{ width: '256px', height: '24px' }}
      >
        ETH
      </div>
      <div
        className="flex text-blue-800 mt-3 text-sm justify-center items-center"
        style={{ width: '343px', height: '36px' }}
      >
        Max fee: ({formatNumber(predictMaxFee, 8)} ETH)
      </div>
      <div
        className="flex text-sm text-darkGreen mt-3 justify-center items-center"
        style={{ width: '343px', height: '36px' }}
      >
        {tempMaxPriorityInGwei <= Number(LOW) && 'Likely in 30 Seconds'}
        {tempMaxPriorityInGwei > Number(LOW) && tempMaxPriorityInGwei < Number(HIGH) && 'Likely in < 30 Seconds'}
        {tempMaxPriorityInGwei >= Number(HIGH) && 'Likely in < 15 Seconds'}
      </div>
      <div
        className="flex mt-5 justify-between items-center"
        style={{ width: '278px', height: '24px' }}
      >
        <div className="cursor-pointer" onClick={() => expressSetFee(LOW)}>
          {feeLevel === LOW ? <SelectedCircle /> : <UnselectedCircle />}
        </div>
        <div className="cursor-pointer" onClick={() => expressSetFee(MEDIUM)}>
          {feeLevel === MEDIUM ? <SelectedCircle /> : <UnselectedCircle />}
        </div>
        <div className="cursor-pointer" onClick={() => expressSetFee(HIGH)}>
          {feeLevel === HIGH ? <SelectedCircle /> : <UnselectedCircle />}
        </div>
      </div>
      <div className="mt-3">
        <ForkIcon />
      </div>
      <div className="flex text-sm justify-between items-center mt-3" style={{ width: '278px' }}>
        <div className={clsx(feeLevel === LOW && 'font-bold')}>Low</div>
        <div className={clsx(feeLevel === MEDIUM && 'font-bold')}>Medium</div>
        <div className={clsx(feeLevel === HIGH && 'font-bold')}>High</div>
      </div>
      <div style={{width:'210px',height:'32px'}} className='flex items-center justify-between px-4 bg-purplelight-100 rounded-lg mt-4 text-sm text-purplelight-300 cursor-pointer' onClick={() => {
        setShowAdvancedInput(prev => !prev)
      }}>
        <div>Advanced Options</div>
        <DropDownIcon />
      </div>
      { showAdvancedInput &&
        <div>
          <div className='mt-8'>
            <div style={{fontSize:'17px',height:'24px'}} className='text-purplelight-300 font-bold flex items-center'>{'Max priority fee (GWEI)'}</div>
            <input
              style={{width:'360px',height:'36px'}}
              className=' bg-purplelight-100 rounded-md text-purplelight-200 mt-1 pl-4'
              value={tempMaxPriorityFee / Math.pow(10, 9)}
              onChange={(e) => {
                setFeeLevel(null)
                setTempMaxPriorityFee(e.target.value * Math.pow(10, 9))
              }}
            />
          </div>
          <div className='mt-6'>
            <div style={{fontSize:'17px',height:'24px'}} className='text-purplelight-300 font-bold flex items-center'>{'Max fee (GWEI)'}</div>
            <input
              style={{width:'360px',height:'36px'}}
              className=' bg-purplelight-100 rounded-md text-purplelight-200 mt-1 pl-4'
              value={tempMaxFeePerGas / Math.pow(10, 9)}
              onChange={(e) => {
                setFeeLevel(null)
                setTempMaxFeePerGas(e.target.value * Math.pow(10, 9))
                setTempIsFixedMaxFeePerGas(true)
                setMaxFeeErrorMessage('')
              }}
            />
            {maxFeeErrorMessage && <div className='text-warning-300 pl-4 mt-2'>{maxFeeErrorMessage}</div>}
          </div>
        </div>

      }
      <button
        onClick={handleSave}
        className='bg-blue-800 text-white my-5 text-base'
        style={{ width: '360px', height: '38px' }}
      >
          Save
      </button>
    </div>
  )
}

export default EditPriorityFee
