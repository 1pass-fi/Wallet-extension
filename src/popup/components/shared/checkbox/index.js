// modules
import React, { useEffect,useState } from 'react'
// assets
import CheckMarkIcon from 'img/check-mark.svg'

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
}) => {
  const [selected, setSelected] = useState(defaultChecked)
  const handleOnClick = () => {
    setSelected((prev) => { return !prev })
  }

  useEffect(() => {
    setSelected(defaultChecked)
  }, [defaultChecked])

  return (
    <div className={`checkbox-container ${className}`}>
      <div className='checkbox-input'>
        <input
          className='checkbox-hidden'
          type='checkbox'
          name={name}
          defaultChecked={defaultChecked}
          disabled={isDisabled}
          onClick={handleOnClick}
          onChange={onChange}
          id={id}
        >
        </input>
        <div className='checkbox-styled' style={{ background: greenBackround && selected ? '#9be7c4' : '#ffffff' }}>
          <div className='check-mark-icon' style={{ visibility: selected ? 'visible' : 'hidden' }}>
            <CheckMarkIcon />
          </div>
        </div>
      </div>
      {
        label.length > 0 &&
        <span className='checkbox-label'>{label}</span>
      }
    </div>
  )
}

export default Checkbox
