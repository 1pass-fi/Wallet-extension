import React, { useState } from 'react'

export default ({ setStage, setPassword, setSeedPhrase, handleGenerateWallet }) => {
  const [passwd, setPasswd] = useState('')
  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault()
      const phrase = await handleGenerateWallet()
      setSeedPhrase(phrase)
      setPassword(passwd)
      setStage(2)
    } catch (err) {
      console.log(err.message)
    }

  }
  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <input name='password' value={passwd} onChange={e => setPasswd(e.target.value)} />
        <button>Create Password</button>
      </form>
    </div>
  )
}
