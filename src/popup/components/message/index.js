// modules
import React, { useEffect, useState } from 'react'

// styles
import './index.css'

export default ({ children, type = 'error' }) => {
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsDisabled(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`message ${type} ${isDisabled ? 'disabled' : ''}`} data-testid="popup-error">
      {children === 'ARWEAVE' ? (
        <div>
          <span>
            Google Chrome and Chromium browsers had a big update at the beginning of the year.
          </span>
          <br></br>
          <span>
            Unfortunately, some components in the Arweave ecosystem haven’t yet been updated and are
            no longer compatible with the new version. As soon as Arweave updates their packages, we
            will be ready to update Finnie to work with the new system.
            <br></br>
            <br></br>
            Reach out to the{' '}
            <i>
              <a href="https://twitter.com/ArweaveTeam">Arweave team</a>
            </i>{' '}
            to let them know you still want to use browser-based Arweave wallets!
          </span>
        </div>
      ) : (
        <div>{ children }</div>
      )}
    </div>
  )
}
