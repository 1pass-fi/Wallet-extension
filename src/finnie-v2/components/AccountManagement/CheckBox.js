import clsx from 'clsx'
import React from 'react'

import CheckIcon from 'img/v2/check-icon-white.svg'

const CheckBox = ({ onClick, checked = false, ...props }) => {
  return (
    <div
      className={clsx(
        'w-4 h-4 inline-block border border-blue-800 rounded-sm cursor-pointer shadow',
        checked && 'bg-blue-600 flex justify-center items-center'
      )}
      onClick={onClick}
      {...props}
    >
      {checked ? <CheckIcon className="w-2.25 h-1.75" /> : null}
    </div>
  )
}

export default CheckBox
