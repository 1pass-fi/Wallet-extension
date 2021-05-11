import React from 'react'
import { useHistory } from 'react-router-dom'

export default ({ handleSaveWallet, handleReloadWallet, password }) => {
  const history = useHistory()
  const handleConfirm = async () => {
    await handleSaveWallet(password)
    await handleReloadWallet()
    history.push('/account')
  }

  return (
    <div>
      <div>CONFIRM SEED</div>
      <button onClick={handleConfirm}>Done</button>
    </div>
  )
}
