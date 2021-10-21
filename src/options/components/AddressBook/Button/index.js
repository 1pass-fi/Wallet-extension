import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import './index.css'

const variantClassName = {
  normal: 'text-green',
  delete: 'big text-red',
  cancel: 'big text-white',
}

const Button = ({
  startIcon: StartIcon = EditIcon,
  text,
  variant,
  isLoading = false,
  ...props
}) => {
  return (
    <button
      className={clsx('addressBookBtn', variantClassName[variant])}
      disabled={isLoading}
      {...props}
    >
      <div className="startIcon">
        <StartIcon />
      </div>
      {text}
    </button>
  )
}

Button.propTypes = {
  startIcon: PropTypes.elementType,
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['normal', 'delete', 'cancel']).isRequired,
  isLoading: PropTypes.bool,
}

export default Button
