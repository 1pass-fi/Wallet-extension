import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import ReactTooltip from 'react-tooltip'

import './InputField.css'

const InputField = ({
  value,
  setValue,
  name,
  label,
  type = 'input',
  required = false,
  description = '',
  error = '',
  className,
  isDisable,
  placeholder,
  maxHeight = 0,
  uppercase = true,
  password = false
}) => {
  const [textAreaHeight, setTextAreaHeight] = useState(83)

  const textAreaRef = useRef(null)

  useEffect(() => {
    if (maxHeight === 0 || type !== 'textarea') return
    const textAreaField = textAreaRef.current
    if (textAreaField) {
      const scrollHeight = textAreaField.scrollHeight
      if (scrollHeight < 83 || value.length < 83) {
        setTextAreaHeight(83)
        return
      }

      if (scrollHeight <= maxHeight) {
        setTextAreaHeight(scrollHeight)
      }

      if (scrollHeight > maxHeight) {
        setTextAreaHeight(maxHeight)
      }
    }
  }, [value])

  return (
    <div className={clsx(className, 'flex flex-col w-full')}>
      <label
        htmlFor={label}
        className={clsx(
          'w-full text-lightBlue text-2xs leading-3 mb-1',
          uppercase ? 'uppercase' : 'ml-2 text-left'
        )}
      >
        {label}
        {`${required ? '*' : ''}`}
      </label>
      {type === 'textarea' ? (
        <div data-tip={isDisable ? 'This NFT version does not support updating' : ''}>
          <textarea
            ref={textAreaRef}
            name={name}
            className="w-full resize-none bg-trueGray-100 bg-opacity-10 border-b border-white text-white px-1 text-area-component"
            style={{ height: `${clsx(textAreaHeight)}px` }}
            placeholder={placeholder || label}
            id={label}
            value={value}
            onChange={(e) => setValue(e)}
            disabled={isDisable}
            data-tip={isDisable ? `This NFT version does not support updating` : ''}
          />
        </div>
      ) : (
        <div data-tip={isDisable ? 'This NFT version does not support updating' : ''}>
          <input
            name={name}
            className="w-full bg-trueGray-100 bg-opacity-10 border-b border-white h-5.25 text-white px-1 input-field-component"
            placeholder={placeholder || label}
            id={label}
            value={value}
            onChange={(e) => setValue(e)}
            disabled={isDisable}
            type={password ? 'password' : 'text'}
          />
        </div>
      )}
      <div
        className={clsx('text-warning mt-1 text-3xs', uppercase ? 'uppercase' : 'ml-2 text-left')}
      >
        {description}
      </div>
      <span className="text-3xs text-bittersweet-200">{error}</span>
      <ReactTooltip place="top" type="dark" effect="float" />
    </div>
  )
}

export default InputField
