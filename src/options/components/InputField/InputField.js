import React, { useEffect, useRef, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import clsx from 'clsx'
import ToggleViewPw from 'img/v2/toggle-icon.svg'

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
  errorFinnie = '',
  className,
  isDisable,
  placeholder,
  maxHeight = 0,
  uppercase = true,
  password = false,
  passwordFinnie = false,
  autoFocus = false,
  onKeyDown = () => {}
}) => {
  const [textAreaHeight, setTextAreaHeight] = useState(83)

  const textAreaRef = useRef(null)

  const [showPw, setShowPw] = useState(false)

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
          'w-full mb-1',
          uppercase ? 'uppercase' : 'ml-2 text-left',
          passwordFinnie ? 'text-xs ml-2.5 text-white' : 'text-2xs leading-3 text-lightBlue'
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
        <div
          data-tip={isDisable ? 'This NFT version does not support updating' : ''}
          className={clsx(passwordFinnie && 'relative')}
        >
          <input
            name={name}
            className={clsx(
              'w-full bg-trueGray-100 bg-opacity-10 border-b border-white text-white',
              passwordFinnie ? 'h-7.5 text-sm pl-2.5 pr-10' : 'h-5.25 px-1 input-field-component'
            )}
            placeholder={placeholder || label}
            id={label}
            value={value}
            onChange={(e) => setValue(e)}
            disabled={isDisable}
            type={password || (passwordFinnie && !showPw) ? 'password' : 'text'}
            autoFocus={autoFocus}
            onKeyDown={(e) => onKeyDown(e)}
          />

          {passwordFinnie && (
            <ToggleViewPw
              onClick={() => setShowPw((prev) => !prev)}
              className="w-6 h-6 cursor-pointer absolute top-1 right-2"
            />
          )}
        </div>
      )}
      <div
        className={clsx(
          'text-warning mt-1 text-left ml-2',
          passwordFinnie ? 'text-xs' : 'text-3xs'
        )}
      >
        {errorFinnie}
      </div>
      <div
        className={clsx(
          'text-warning mt-1',
          uppercase ? 'uppercase' : 'ml-2 text-left',
          passwordFinnie ? 'text-xs' : 'text-3xs'
        )}
      >
        {description}
      </div>
      <span className="text-3xs text-bittersweet-200">{error}</span>
      <ReactTooltip place="top" type="dark" effect="float" />
    </div>
  )
}

export default InputField
