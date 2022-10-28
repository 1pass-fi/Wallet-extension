import React from 'react'

import CheckBoxDark from './CheckBoxDark'
import CheckBoxLight from './CheckBoxLight'

const CheckBox = ({ onClick, disabled, checked = false, className, theme = 'light', ...props }) => {
  if (theme === 'dark') {
    return (
      <CheckBoxDark
        onClick={onClick}
        disabled={disabled}
        checked={checked}
        className={className}
        {...props}
      />
    )
  }

  return (
    <CheckBoxLight
      onClick={onClick}
      disabled={disabled}
      checked={checked}
      className={className}
      {...props}
    />
  )
}

export default CheckBox
