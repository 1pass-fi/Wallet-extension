import React from 'react'
import clsx from 'clsx'

const variants = {
  light: 'bg-trueGray-100 text-indigo font-semibold',
  indigo: 'bg-blue-800 text-white font-normal',
  primary: 'bg-success text-indigo',
  warning: 'bg-warning-200 text-indigo shadow',
  warningDefault: 'bg-warning text-indigo shadow',
  warning300: 'bg-warning-300 text-indigo shadow',
  inversed: 'border border-solid border-white text-white',
  inversedIndigo: 'border-2 border-solid border-blue-800 text-indigo font-semibold',
  lightBlue: 'bg-lightBlue text-indigo',
  white: 'bg-white shadow-md rounded-finnie text-indigo font-normal'
}

const sizes = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-base px-4 py-1.75',
  lg: 'text-base px-4 py-1.75'
}

const Button = ({ text, variant = 'primary', icon: Icon, size = 'sm', className, ...props }) => {
  return (
    <button
      className={clsx(
        variants[variant],
        'flex items-center justify-center rounded-sm disabled:opacity-60 disabled:cursor-not-allowed border',
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon
          className={clsx(
            size === 'sm' && 'w-5 h-5 pr-1',
            size === 'md' && 'w-6 h-6 pr-2',
            size === 'lg' && 'w-8 h-8 pr-2'
          )}
        />
      )}
      {text}
    </button>
  )
}

export default Button
