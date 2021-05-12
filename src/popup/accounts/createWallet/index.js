import React, { useState, useContext } from 'react'

import CreatePassword from './createPassword'
import RevealSeed from './revealSeed'
import ConfirmSeed from './confirmSeed'

import Context from 'popup/context'
import './index.css'

const Wrapper = ({ stage, setStage }) => {
  const { handleGenerateWallet, handleSaveWallet, handleReloadWallet } = useContext(Context)
  const [password, setPassword] = useState(null)
  const [seedPhrase, setSeedPhrase] = useState([])
  return (
    <div className='create-wallet'>
      {stage === 1 && <CreatePassword
        setStage={setStage}
        setPassword={setPassword}
        setSeedPhrase={setSeedPhrase}
        handleGenerateWallet={handleGenerateWallet} />
      }

      {stage === 2 && <RevealSeed setStage={setStage} seedPhrase={seedPhrase} password={password} />}

      {stage === 3 && <ConfirmSeed
        password={password}
        seedPhrase={seedPhrase}
        handleSaveWallet={handleSaveWallet}
        handleReloadWallet={handleReloadWallet} />}
    </div>
  )
}

export default () => {
  const [stage, setStage] = useState(1)

  return (
    <Wrapper stage={stage} setStage={setStage} />
  )
}
