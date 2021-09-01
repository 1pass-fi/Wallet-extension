// modules
import React from 'react'

// styles
import './index.css'


export default ({ value, setValue }) => {
  const onToggle = (e) => {
    setValue(e.target.checked)
  }
  return (
    <label className='switch'>
      <input type='checkbox' id='togBtn' value={value} onChange={onToggle} />
      {/* {value ? (
        <span className='on'>ON</span>
      ) : (
        <span className='off'>OFF</span>
      )} */}
      <div className={`slider round ${value ? 'checked' : ''}`}></div>
    </label>
  )
}
