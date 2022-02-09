import React from 'react'

import CheckBoxLight from './CheckBoxLight'
import CheckBoxDark from './CheckBoxDark'

const CheckBox = ({ onClick, checked = false, className, theme = 'light', ...props }) => {
  if (theme === 'dark') {
    return <CheckBoxDark onClick={onClick} checked={checked} className={className} {...props} />
  }

  return <CheckBoxLight onClick={onClick} checked={checked} className={className} {...props} />
}

export default CheckBox
