import React, { useEffect, useMemo, useRef, useState } from 'react'
import DownIcon from 'img/down-icon.svg'
import find from 'lodash/find'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const Dropdown = ({ width, height, options, value, onChange, style }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedValue, setSelectedValue] = useState(null)

  const label = useMemo(() => find(options, { value: selectedValue })?.label || chrome.i18n.getMessage('noneSelect'), [selectedValue])

  const dropDownRef = useRef(null)

  useEffect(() => {
    if (value) setSelectedValue(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    const handlePressingEsc = (event) => {
      if (event.defaultPrevented) {
        return // Should do nothing if the default action has been cancelled
      }

      if (event.key === 'Escape') {
        setShowDropdown(false)
        setFilterValue(label)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handlePressingEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handlePressingEsc)
    }
  }, [dropDownRef, label])

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev)
  }

  const selectOption = (option) => {
    setShowDropdown(false)
    setSelectedValue(get(option, 'value'))
    onChange(get(option, 'value'))
  }

  return (
    <div style={{
      width: width || 325,
      height: height || 32,
      ...style
    }} className=' bg-purplelight-400 rounded-lg text-sm font-normal flex items-center justify-center relative'
    ref={dropDownRef}  
    >
      {/* selected value */}
      <div onClick={toggleDropdown} className='w-full h-full flex flex-row justify-between items-center cursor-pointer select-none'>
        <div className='ml-5'>{label}</div>
        {!isEmpty(options) && <div className='mr-5'><DownIcon /></div>}
      </div>

      {/* options */}
      {showDropdown && <div 
        style={{
          width: width || 325,
          top: height + 5 || 32 + 5
        }} className='z-50 max-h-72 absolute bg-purplelight-400 rounded-lg overflow-y-auto py-1'
        
      >
        {options.map((option, index) => (
          <div onClick={() => selectOption(option)} key={index} className='ml-5 cursor-pointer select-none'>
            {get(option, 'label', undefined)}
          </div>
        ))}
      </div>}
    </div>
  )
}

export default Dropdown
