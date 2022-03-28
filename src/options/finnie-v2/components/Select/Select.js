import clsx from 'clsx'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import inclues from 'lodash/includes'
import lowerCase from 'lodash/lowerCase'

import DownIconBlue from 'img/v2/dropdown/down-icon-blue.svg'
import DownIconWhite from 'img/v2/dropdown/down-icon-white.svg'

const Select = ({ options, value, onChange, emptyOption = false }) => {
  const [listOpened, setListOpened] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  const [hoverOption, setHoverOption] = useState(false)

  const dropDownRef = useRef(null)
  const optionRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropDownRef.current &&
        optionRef.current &&
        !dropDownRef.current.contains(event.target) &&
        !optionRef.current.contains(event.target)
      ) {
        setListOpened(false)
        setHoverOption(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropDownRef])

  useEffect(() => {
    const currentProvider = find(options, (o) => o.value === value)
    // console.log('value changed', currentProvider)
    setSelectedItem(currentProvider ? currentProvider : {})
  }, [value])

  const toggleList = () => {
    setListOpened((prev) => !prev)
    setHoverOption(true)
  }

  const selectItem = (item) => {
    setListOpened(false)
    setHoverOption(false)
    setSelectedItem(item)
    onChange(item.value)
  }

  const handleHoverOption = () => {
    if (listOpened) {
      return
    } else setHoverOption(false)
  }

  return (
    <div className="w-full relative text-left bg-transparent" style={{ width: '144px' }}>
      <div
        className={clsx(
          'absolute z-20 flex items-center justify-between cursor-pointer bg-transparent px-2.25 w-full',
          hoverOption && 'bg-cyan shadow-md rounded-3xl'
        )}
        onMouseOver={() => setHoverOption(true)}
        onMouseOut={() => handleHoverOption()}
        onClick={toggleList}
        ref={optionRef}
      >
        <div
          readOnly
          className={clsx(
            'cursor-pointer focus:outline-none bg-transparent font-normal text-sm leading-8 tracking-finnieSpacing-tight text-blue-800 select-none'
          )}
        >
          {!isEmpty(selectedItem?.label) ? selectedItem.label : ''}
        </div>
        <DownIconBlue style={{ Width: '7.05px', height: '3.33px' }} className="cursor-pointer" />
      </div>
      {listOpened && (
        <div
          className={clsx(
            'z-10 pt-8 top-0 absolute w-full max-h-72 flex flex-col overflow-y-auto rounded-b-finnie select-none',
            'bg-cyan shadow rounded-b-lg rounded-t-3xl'
          )}
          ref={dropDownRef}
        >
          {options.map((item, idx) => (
            <button
              className={clsx(
                'text-left pl-2.25',
                'font-normal text-sm leading-8 tracking-finnieSpacing-tight text-blue-800 hover:bg-blue-800 hover:text-cyan'
              )}
              key={idx}
              onClick={() => selectItem(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Select
