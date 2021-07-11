import React, { useState } from 'react'

import CheckMarkIcon from 'img/check-mark.svg'
import './index.css'

const Checkbox = ({
  defaultChecked = false,
  greenBackround = true,
  label = '',
  name,
  onChange,
  className,
  isDisabled = false,
}) => {
  const [selected, setSelected] = useState(defaultChecked)
  const handleOnClick = () => {
    setSelected((prev) => {return !prev})
  }

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
          onChange = {onChange}
          id='check-terms'
        >
        </input>
        <div className='checkbox-styled' style={{background: greenBackround && selected ? '#9be7c4' : '#ffffff' }}> 
          <div className='check-mark-icon' style={{visibility: selected ? 'visible' : 'hidden'}}>
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
