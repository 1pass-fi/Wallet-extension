// modules
import React, { useEffect, useState } from 'react'

// assets
import DownArrowIcon from 'img/v2/dropdown/down-icon-blue.svg'

import formatLongString from 'finnie-v2/utils/formatLongString'

// styles
// import './index.css'

export const Select = ({
  options,
  defaultOption = '',
  label = '',
  placeholder = '',
  className = '',
  onChange,
  isAccountAddress
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [downArrow, setDownArrow] = useState(true)
  const [selectedOption, setSelectedOption] = useState(defaultOption)

  const handleSelect = (e) => {
    e.preventDefault()
    setSelectedOption(e.target.id)
    setShowMenu(false)
    setDownArrow(true)
    onChange(e.target.value)
  }

  const handleShowMenu = (e) => {
    e.preventDefault()
    setDownArrow((prev) => {
      return !prev
    })
    setShowMenu((prev) => {
      return !prev
    })
  }

  useEffect(() => {
    setSelectedOption(defaultOption)
  }, [options])

  return (
    <div className="w-full flex flex-col">
      {label.length > 0 && <div className="text-sm pl-1.5 mb-1.5 font-semibold">{label}</div>}
      <div className="w-full relative text-left rounded-finnie border-t-2 border-r-2 border-l-2 border-white shadow-lg">
        <div className="border-b-2 rounded-finnie border-white text-white h-8 flex">
          <input
            readOnly
            type="text"
            className="w-full cursor-pointer text-white border-b-2 text-sm font-semibold border-white bg-blue-800 h-8 pl-2 flex-grow rounded-l-finnie focus:outline-none placeholder-trueGray-400"
            placeholder={placeholder}
            value={selectedOption}
            onClick={handleShowMenu}
          />
          <button
            className="border-b-2 border-white flex items-center justify-center bg-white w-8 h-8 rounded-r-finnie"
            onClick={handleShowMenu}
          >
            <DownArrowIcon
              className="h-1.75 w-3.25"
              style={{ transform: downArrow ? 'none' : 'rotateX(180deg)' }}
            />
          </button>
        </div>
        {showMenu && (
          <div className="bg-blue-800 border-b-2 border-white z-40 absolute w-full max-h-72 flex flex-col overflow-y-auto rounded-b-finnie select-none">
            {options.map((option) => {
              return (
                <button
                  className="text-left pl-2 h-8 text-white text-sm hover:bg-blue-500"
                  value={option.value}
                  key={option.id + option.label}
                  onClick={handleSelect}
                  id={option.label}
                >
                  {`${formatLongString(option.label, 12)} ${
                    isAccountAddress ? option.address.slice(0, 24) + '...' : ''
                  }`}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Select
