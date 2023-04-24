import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import { ethers } from 'ethers'
import DropDownIcon from 'img/dropdown-icon.svg'
import ForkIcon from 'img/fork-icon.svg'
import SelectedCircle from 'img/selected-circle.svg'
import UnselectedCircle from 'img/unselected-circle.svg'
import get from 'lodash/get'
import { formatNumber } from 'options/utils'

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

  const [stringValuePriorityFee, setStringValuePriorityFee] = useState('')
  const [stringValueMaxFee, setStringValueMaxFee] = useState('')

  const networkMetadata = useSelector(state => state.networkMetadata)

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
  /*
  Display the decimal point or "0" using string
  The remaining cases dynamically display the input value using state.
  */
  const handleOnChangePriorityInput = (e) => {
    if (e.target.value === '') {
      setStringValuePriorityFee('0')
    } else {
      const reg = new RegExp(/^\d+((.)|(.\d{0,9})?)$/)
      if (reg.test(e.target.value)) {
        if (e.target.value >= 999999) {
          return
        }
        if (e.target.value[e.target.value.length - 1] === '.') {
          setStringValuePriorityFee(e.target.value)
        } else {
          setStringValuePriorityFee('')
        }
        setFeeLevel(null)
        setTempMaxPriorityFee(ethers.utils.parseUnits(e.target.value, 'gwei').toNumber())
      }
    }
  }

  const handleOnChangeMaxFeeInput = (e) => {
    if (e.target.value === '') {
      setStringValueMaxFee('0')
    } else {
      const reg = new RegExp(/^\d+((.)|(.\d{0,9})?)$/)
      if (reg.test(e.target.value)) {
        if (e.target.value >= 999999) {
          return
        }
        if (e.target.value[e.target.value.length - 1] === '.') {
          setStringValueMaxFee(e.target.value)
        } else {
          setStringValueMaxFee('')
        }
        setFeeLevel(null)
        setTempMaxFeePerGas(ethers.utils.parseUnits(e.target.value, 'gwei').toNumber())
        setTempIsFixedMaxFeePerGas(true)
        setMaxFeeErrorMessage('')
      }
    }
  }

  return (
    <div className="flex flex-col items-center w-full overflow mt-2 text-indigo">
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
        {get(networkMetadata, 'currencySymbol')}
      </div>
      <div
        className="flex text-blue-800 mt-3 text-sm justify-center items-center"
        style={{ width: '343px', height: '36px' }}
      >
        {chrome.i18n.getMessage('maxFee')}: ({formatNumber(predictMaxFee, 8)} {get(networkMetadata, 'currencySymbol')})
      </div>
      <div
        className="flex text-sm text-darkGreen mt-3 justify-center items-center"
        style={{ width: '343px', height: '36px' }}
      >
        {tempMaxPriorityInGwei <= Number(LOW) && chrome.i18n.getMessage('likelyIn30Seconds')}
        {tempMaxPriorityInGwei > Number(LOW) && tempMaxPriorityInGwei < Number(HIGH) && chrome.i18n.getMessage('likelyInLessThan30Seconds')}
        {tempMaxPriorityInGwei >= Number(HIGH) && chrome.i18n.getMessage('likelyInLessThan15Seconds')}
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
        <div className={clsx(feeLevel === LOW && 'font-bold')}>{chrome.i18n.getMessage('low')}</div>
        <div className={clsx(feeLevel === MEDIUM && 'font-bold')}>{chrome.i18n.getMessage('medium')}</div>
        <div className={clsx(feeLevel === HIGH && 'font-bold')}>{chrome.i18n.getMessage('high')}</div>
      </div>
      <div style={{width:'210px',height:'32px'}} className='flex items-center justify-between px-4 bg-purplelight-100 rounded-lg mt-4 text-sm text-purplelight-300 cursor-pointer' onClick={() => {
        setShowAdvancedInput(prev => !prev)
      }}>
        <div>{chrome.i18n.getMessage('advancedOptions')}</div>
        <DropDownIcon />
      </div>
      { showAdvancedInput &&
        <div>
          <div className='mt-8'>
            <div style={{fontSize:'17px',height:'24px'}} className='text-purplelight-300 font-bold flex items-center'>{chrome.i18n.getMessage('maxPriorityFee') + ' (GWEI)'}</div>
            <input
              style={{width:'360px',height:'36px'}}
              className=' bg-purplelight-100 rounded-md text-purplelight-200 mt-1 pl-4'
              value={stringValuePriorityFee || tempMaxPriorityFee / Math.pow(10, 9)}
              onChange={handleOnChangePriorityInput}
            />
          </div>
          <div className='mt-6'>
            <div style={{fontSize:'17px',height:'24px'}} className='text-purplelight-300 font-bold flex items-center'>{chrome.i18n.getMessage('maxFee') + ' (GWEI)'}</div>
            <input
              style={{width:'360px',height:'36px'}}
              className=' bg-purplelight-100 rounded-md text-purplelight-200 mt-1 pl-4'
              value={stringValueMaxFee || tempMaxFeePerGas / Math.pow(10, 9)}
              onChange={handleOnChangeMaxFeeInput}
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
        {chrome.i18n.getMessage('save')}
      </button>
    </div>
  )
}

export default EditPriorityFee
