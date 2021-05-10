import React from 'react'
import './index.css'

export default ({ label, onClick, isEnable }) => {
  return (
    <button disabled={!isEnable} onClick={onClick} className="button-shared">{label}</button>
  )
}
