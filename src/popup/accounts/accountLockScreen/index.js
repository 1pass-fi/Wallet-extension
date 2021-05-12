import React, { useContext } from 'react'

import Context from 'popup/context'

import './index.css'

export default () => {
  const { handleUnlockWallet } = useContext(Context)

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    const password = e.target.pwd.value
    await handleUnlockWallet(password)
  }

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <input name='pwd' />
        <button>Unlock</button>
      </form>
    </div>
  )
}
