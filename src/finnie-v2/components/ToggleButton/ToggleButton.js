import clsx from 'clsx'
import React from 'react'

const ToggleButton = ({ isActive, onClick, text }) => {
  return (
    <div
      className={clsx(
        isActive ? 'bg-lightBlue text-indigo' : 'border-white',
        'h-7 min-w-21 p-1 border text-white text-xs rounded flex items-center justify-center cursor-pointer finnieSpacing-wider flex-grow'
      )}
      onClick={onClick}
    >
      {text}
    </div>
  )
}

export default ToggleButton
