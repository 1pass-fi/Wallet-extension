import clsx from 'clsx'
import React from 'react'

const ToggleButton = ({ isActive, onClick, text }) => {
  return (
    <div
      className={clsx(
        isActive ? 'bg-lightBlue text-indigo' : 'border-white',
        'h-7 w-24 border text-white text-xs rounded flex items-center justify-center cursor-pointer finnieSpacing-wider'
      )}
      onClick={onClick}
    >
      {text}
    </div>
  )
}

export default ToggleButton
