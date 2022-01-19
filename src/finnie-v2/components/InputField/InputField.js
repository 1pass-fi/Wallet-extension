import React from 'react'
import clsx from 'clsx'

const InputField = ({
  value,
  setValue,
  name,
  label,
  type = 'input',
  required = false,
  description = '',
  error = '',
  className
}) => {
  return (
    <div className={clsx(className, 'flex flex-col w-full')}>
      <label htmlFor={label} className="w-full uppercase text-lightBlue text-2xs leading-3 mb-1">
        {label}
        {`${required ? '*' : ''}`}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          className="w-full resize-none bg-trueGray-100 bg-opacity-10 border-b border-white h-20.75 text-white px-1"
          placeholder={label}
          id={label}
          value={value}
          onChange={(e) => setValue(e)}
        />
      ) : (
        <input
          name={name}
          className="w-full bg-trueGray-100 bg-opacity-10 border-b border-white h-5.25 text-white px-1"
          placeholder={label}
          id={label}
          value={value}
          onChange={(e) => setValue(e)}
        />
      )}
      <div className="text-warning mt-1 uppercase text-3xs">{description}</div>
      <span className="text-3xs text-bittersweet-200">{error}</span>
    </div>
  )
}

export default InputField
