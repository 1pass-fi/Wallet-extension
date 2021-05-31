import React, { useState, useEffect } from 'react'

import CheckMarkIcon from 'img/check-mark.svg'
import './index.css'

const Checkbox = ({
  defaultChecked,
  label = '',
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
          defaultChecked={defaultChecked}
          disabled={isDisabled}
          onClick={handleOnClick}
          onChange = {onChange}
        >
        </input>
        <div className='checkbox-styled' style={{background: selected ? '#9be7c4' : '#ffffff' }}> 
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
