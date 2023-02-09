import React from 'react'
import clsx from 'clsx'
import CheckIcon from 'img/v2/check-icon-orange.svg'

const CheckBoxDark = ({ onClick, disabled, checked = false, className, ...props }) => {
  return (
    <div
      className={clsx(
        'w-4 h-4 inline-block border border-white rounded-sm cursor-pointer shadow',
        checked && 'flex justify-center items-center',
        className,
        disabled && 'cursor-not-allowed opacity-50'
      )}
      onClick={!disabled ? onClick : () => {}}
      {...props}
      role="checkbox"
    >
      {checked ? <CheckIcon className="w-2.25 h-1.75" /> : null}
    </div>
  )
}

export default CheckBoxDark
