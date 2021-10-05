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
      <input type='checkbox' defaultChecked={!value} id='togBtn' onChange={onToggle} />
      <div className={`slider round ${value ? 'checked' : ''}`}></div>
    </label>
  )
}
