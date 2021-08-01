import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

import CreatePassword from './createPassword'
import RevealSeed from './revealSeed'
import ConfirmSeed from './confirmSeed'

import { setCreateWallet } from 'actions/createWallet'
import { generateWallet, saveWallet } from 'actions/koi'
import './index.css'

const Wrapper = ({ createWallet, setCreateWallet, generateWallet, saveWallet, walletType }) => {
  // const [password, setPassword] = useState(null)
  // const [seedPhrase, setSeedPhrase] = useState(null)

  return (
    <div className='create-wallet'>
      {createWallet.stage === 1 && <CreatePassword
        setCreateWallet={setCreateWallet}
        generateWallet={generateWallet}
        walletType={walletType} 
      />
      }

      {createWallet.stage === 2 && <RevealSeed
        setCreateWallet={setCreateWallet}
        password={createWallet.password}
        seedPhrase={createWallet.seedPhrase}
      />}

      {createWallet.stage === 3 && <ConfirmSeed
        password={createWallet.password}
        seedPhrase={createWallet.seedPhrase}
        saveWallet={saveWallet}
        walletType={walletType}
      />}
    </div>
  )
}

export const CreateWallet = ({ generateWallet, saveWallet, createWallet }) => {
  const { search } = useLocation()
  const walletType = (new URLSearchParams(search)).get('type')

  return (
    <Wrapper
      walletType={walletType}
      createWallet={createWallet}
      setCreateWallet={setCreateWallet}
      generateWallet={generateWallet}
      saveWallet={saveWallet}
    />
  )
}

const mapStateToProps = (state) => ({ createWallet: state.createWallet })

export default connect(mapStateToProps, { generateWallet, saveWallet, setCreateWallet })(CreateWallet)
