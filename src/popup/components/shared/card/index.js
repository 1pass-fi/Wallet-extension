// modules
import React from 'react'

// styles
import './index.css'


export default ({ children, className }) => {
  return (
    <div className={'card ' + className}>
      {children}
    </div>
  )
}
