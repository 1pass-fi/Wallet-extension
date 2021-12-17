import React from 'react'
import clsx from 'clsx'

const variants = {
  light: 'bg-trueGray-100 text-indigo',
  indigo: 'bg-blue-800 text-white',
  primary: 'bg-success text-indigo',
  warning: 'bg-warning-200 text-indigo shadow',
  inversed: 'border border-solid border-white text-white',
  lightBlue: 'bg-lightBlue text-indigo'
}

const sizes = {
  sm: 'text-xs px-3 py-1.5',
  lg: 'text-base px-4 py-1.75'
}

const Button = ({
  text,
  variant = 'primary',
  icon: Icon,
  loading,
  size = 'sm',
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'flex items-center justify-center rounded-sm',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className={clsx(size === 'sm' ? 'w-5 h-5 pr-1' : 'w-8 h-8 pr-2')} />}
      {text}
    </button>
  )
}

export default Button
