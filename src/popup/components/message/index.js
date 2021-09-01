// modules
import React, { useEffect, useState } from 'react'

// styles
import './index.css'


export default ({ children, type='error' }) => {
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsDisabled(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`message ${type} ${isDisabled ? 'disabled' : ''}`}>
      {children}
    </div>
  )
}
