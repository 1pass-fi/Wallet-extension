import React, { useEffect, useState } from 'react'

import './index.css'

export default ({ children }) => {
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsDisabled(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`error-message ${isDisabled ? 'disabled' : ''}`}>
      {children}
    </div>
  )
}
