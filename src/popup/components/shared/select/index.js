// modules
import React, { useEffect, useState } from 'react'

// assets
import DownArrowIcon from 'img/down-arrow-icon.svg'

// styles
import './index.css'


export const Select = ({ 
  options,
  defaultOption = '', 
  label='', 
  placeholder='' ,
  className='',
  onChange,
  isAccountAddress
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [downArrow, setDownArrow] = useState(true)
  const [selectedOption, setSelectedOption] = useState(defaultOption)

  const handleSelect = (e) => {
    e.preventDefault()
    setSelectedOption(e.target.value)
    setShowMenu(false)
    setDownArrow(true)
    onChange(e.target.value)
  }

  const handleShowMenu = (e) => {
    e.preventDefault()
    setDownArrow((prev) => {return !prev})
    setShowMenu((prev) => {return !prev})
  }

  useEffect(() => {
    setSelectedOption(defaultOption)
  }, [options])

  return (
    <div className={`select-container ${className}`}>
      {
        label.length > 0 && <div className='label'>{label}</div>
      }
      <div className='select-wrapper' >
        <div className="header">
          <input
            readOnly
            type='text'  
            className="selected-option"
            placeholder={placeholder} 
            value={selectedOption}
          />
          <button 
            className="arrow-button" 
            onClick={handleShowMenu}
          >
            <div className='arrow-icon' style={{transform: downArrow ? 'none' : 'rotateX(180deg)'}}>
              <DownArrowIcon />
            </div>
          </button>
        </div>
        {showMenu && (
          <div className="select-options">
            {options.map((option) => {
              return (
                <button
                  className="option"
                  value={option.value}
                  key={option.id + option.label}
                  onClick={handleSelect}
                >{option.label} {isAccountAddress && <button value={option.value} className='address-text'>{option.address.slice(0, 6)}</button>}</button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Select
