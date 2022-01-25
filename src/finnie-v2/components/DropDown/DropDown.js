import clsx from 'clsx'
import React, { useState, useRef, useEffect } from 'react'
import find from 'lodash/find'

import DownIconBlue from 'img/v2/dropdown/down-icon-blue.svg'
import DownIconWhite from 'img/v2/dropdown/down-icon-white.svg'

const variants = {
  dark: {
    wrapper: 'border border-white',
    header: 'border-b-white text-white bg-blue-800',
    body: 'border border-white bg-blue-800 border-t-none',
    row: 'hover:bg-white hover:bg-opacity-20'
  },
  light: {
    wrapper: 'border border-blue-800',
    header: 'border-b-blue-800 text-blue-800 bg-white',
    body: 'border border-blue-800 text-blue-800 bg-white border-t-none',
    row: 'hover:bg-blue-800 hover:bg-opacity-20'
  }
}

const sizes = {
  sm: {
    wrapper: 'text-sm',
    header: 'h-5 pl-1',
    row: 'pl-1'
  },
  lg: {
    wrapper: 'text-base',
    header: 'h-8 pl-2',
    row: 'pl-2'
  }
}

const DropDown = ({ options, value, onChange, variant = 'dark', size = 'lg' }) => {
  const [listOpened, setListOpened] = useState(false)

  const dropDownRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setListOpened(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropDownRef])

  const toggleList = () => {
    setListOpened((prev) => !prev)
  }

  const selectItem = (item) => {
    setListOpened(false)
    onChange(item.value)
  }

  return (
    <div
      className={clsx(
        'w-full relative text-left rounded-finnie',
        sizes[size].wrapper,
        variants[variant].wrapper
      )}
      ref={dropDownRef}
    >
      <div
        onClick={toggleList}
        className={clsx(
          'cursor-pointer rounded-finnie flex items-center truncate',
          sizes[size].header,
          variants[variant].header
        )}
      >
        {find(options, { value }).label}
        <div
          className={clsx(
            'absolute -right-0.25 top-0 flex items-center justify-center rounded-r-finnie',
            size === 'lg' ? 'w-8 h-8' : 'w-5 h-5',
            variant === 'light' ? 'bg-blue-800' : 'bg-white'
          )}
        >
          {variant === 'light' ? (
            <DownIconWhite className="h-1.75 w-3.25" />
          ) : (
            <DownIconBlue className="h-1.75 w-3.25" />
          )}
        </div>
      </div>
      {listOpened && (
        <div
          className={clsx(
            'absolute w-full h-36 flex flex-col overflow-y-auto rounded-b-finnie select-none',
            variants[variant].body
          )}
        >
          {options.map((item, idx) => (
            <button
              className={(clsx('text-left', sizes[size].row), variants[variant].row)}
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

export default DropDown
