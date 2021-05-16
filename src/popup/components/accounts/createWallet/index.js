import React, { useState, useContext } from 'react'
import { connect } from 'react-redux'

import CreatePassword from './createPassword'
import RevealSeed from './revealSeed'
import ConfirmSeed from './confirmSeed'

import { setCreateWallet } from 'actions/createWallet'
import { generateWallet, saveWallet } from 'actions/koi'

import Context from 'popup/context'
import './index.css'

const Wrapper = ({ createWallet, setCreateWallet, generateWallet, saveWallet }) => {
  // const [password, setPassword] = useState(null)
  // const [seedPhrase, setSeedPhrase] = useState(null)

  const handleCancel = () => {
    setCreateWallet({
      stage: 1,
      password: null,
      seedPhrase: null
    })
  }

  return (
    <div className='create-wallet'>
      {createWallet.stage === 1 && <CreatePassword
        setCreateWallet={setCreateWallet}
        generateWallet={generateWallet} />
      }

      {createWallet.stage === 2 && <RevealSeed
        setCreateWallet={setCreateWallet}
        password={createWallet.password}
        seedPhrase={createWallet.seedPhrase}
        handleCancel={handleCancel} />}

      {createWallet.stage === 3 && <ConfirmSeed
        password={createWallet.password}
        seedPhrase={createWallet.seedPhrase}
        saveWallet={saveWallet}
        handleCancel={handleCancel} />}
    </div>
  )
}

export const CreateWallet = ({ generateWallet, saveWallet, createWallet }) => {
  return (
    <Wrapper 
      createWallet={createWallet}
      setCreateWallet={setCreateWallet} 
      generateWallet={generateWallet}
      saveWallet={saveWallet}
    />
  )
}

const mapStateToProps = (state) => ({ createWallet: state.createWallet })

export default connect(mapStateToProps, { generateWallet, saveWallet, setCreateWallet })(CreateWallet)
