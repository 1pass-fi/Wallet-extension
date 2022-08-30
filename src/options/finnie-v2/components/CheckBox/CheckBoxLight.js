import React from 'react'
import clsx from 'clsx'
import CheckIcon from 'img/v2/check-icon-white.svg'

const CheckBoxLight = ({ onClick, disabled, checked = false, className, ...props }) => {
  return (
    <div
      className={clsx(
        'w-4 h-4 inline-block border border-blue-800 rounded-sm cursor-pointer shadow',
        checked && 'bg-blue-600 flex justify-center items-center',
        className,
        disabled && 'cursor-not-allowed opacity-50'
      )}
      onClick={!disabled ? onClick : () => {}}
      {...props}
    >
      {checked ? <CheckIcon className="w-2.25 h-1.75" /> : null}
    </div>
  )
}

export default CheckBoxLight
