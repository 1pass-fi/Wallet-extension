// modules
import React, { useEffect,useState } from 'react'
import clsx from 'clsx'
// assets
import CheckMarkIcon from 'img/check-mark-white.svg'

// styles
import './index.css'

const Checkbox = ({
  defaultChecked = false,
  greenBackround = true,
  label = '',
  name,
  onChange,
  className,
  isDisabled = false,
  id,
  isNewDesign = false
}) => {
  const [selected, setSelected] = useState(defaultChecked)
  const handleOnClick = () => {
    setSelected((prev) => {
      return !prev
    })
  }

  useEffect(() => {
    setSelected(defaultChecked)
  }, [defaultChecked])

  return (
    <div
      className={`checkbox-container ${className}`}
      style={isNewDesign ? { alignItems: 'flex-start' } : { alignItems: 'center' }}
    >
      <div className="checkbox-input">
        <input
          className={clsx('checkbox-hidden', isDisabled ? 'cursor-not-allowed' : 'cursor-pointer')}
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          disabled={isDisabled}
          onClick={handleOnClick}
          onChange={onChange}
          id={id}
        ></input>
        <div
          className="checkbox-styled"
          style={{ background: selected ? '#4E4E8D' : '#FFFFFF' }}
        >
          <div className="check-mark-icon" style={{ visibility: selected ? 'visible' : 'hidden' }}>
            <CheckMarkIcon style={{ width: '9px', height: '7px' }} />
          </div>
        </div>
      </div>
      {label.length > 0 && <span className="checkbox-label">{label}</span>}
    </div>
  )
}

export default Checkbox
