import React from 'react'
import './index.css'
import { Route, Switch } from 'react-router-dom'

import AccountHome from './accountHome'
import AccountImport from './accountImport'
import ConnectToWallet from './connectToWallet'
import ImportPhrase from './importByPhrase'
import ImportFile from './importByFile'
import ImportFileSuccess from './importByFileSuccess'
import ImportPhraseSuccess from './importByPhraseSuccess'
import CreateWallet from './createWallet'
import Login from './accountLockScreen'
import ImportPhraseLockScreen from './importPhraseLockScreen'
import ConnectSite from './connectToWallet'
import SignTx from './signTx'
import WelcomeScreen from './welcomeScreen'
import CreateWalletSuccess from './createWalletSuccess'

const Account = () => {
  return (
    <Switch>
      <Route exact path='/account'>
        <AccountHome />
      </Route>
      <Route path='/account/import/phrase/success'>
        <ImportPhraseSuccess />
      </Route>
      <Route path='/account/import/phrase'>
        <ImportPhrase />
      </Route>
      <Route path='/account/import/keyfile/success'>
        <ImportFileSuccess />
      </Route>
      <Route path='/account/import/keyfile'>
        <ImportFile />
      </Route>
      <Route path='/account/connect'>
        <ConnectToWallet />
      </Route>
      <Route path='/account/import'>
        <AccountImport />
      </Route>
      <Route path='/account/create/success'>
        <CreateWalletSuccess />
      </Route>
      <Route path='/account/create'>
        <CreateWallet />
      </Route>
      <Route path='/account/login/phrase'>
        <ImportPhraseLockScreen />
      </Route>
      <Route path='/account/login'>
        <Login />
      </Route>
      <Route path='/account/connect-site'>
        <ConnectSite />
      </Route>
      <Route path='/account/sign-transaction'>
        <SignTx />
      </Route>
      <Route path='/account/welcome'>
        <WelcomeScreen />
      </Route>
    </Switch>
  )
}

export default Account
