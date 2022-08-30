// modules
import React from 'react'
import { Route, Switch } from 'react-router-dom'

// components
import AccountHome from './accountHome'
import AccountImport from './accountImport'
import Login from './accountLockScreen'
import ConnectToWallet from './connectToWallet'
import ConnectSite from './connectToWallet'
import Recovery from './recoverKeyfile'
import SignTx from './signTx'
import WelcomeScreen from './welcomeScreen'

// styles
import './index.css'


const Account = () => {
  return (
    <Switch>
      <Route exact path='/account'>
        <AccountHome />
      </Route>
      <Route path='/account/connect'>
        <ConnectToWallet />
      </Route>
      <Route path='/account/import'>
        <AccountImport />
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
      <Route path='/account/recovery'>
        <Recovery />
      </Route>
    </Switch>
  )
}

export default Account
