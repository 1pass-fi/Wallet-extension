import React from 'react'
import './index.css'
import { Route, Switch } from 'react-router-dom'

import AccountHome from './accountHome'
import AccountImport from './accountImport'
import ImportPhrase from './importByPhrase/index'
import ImportFile from './importByFile/index'
import ImportFileSuccess from './importByFileSuccess/index'
import ImportPhraseSuccess from './importByPhraseSuccess/index'
import CreateWallet from './createWallet/index'
import Login from './accountLockScreen/index'

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
      <Route path='/account/import'>
        <AccountImport />
      </Route>
      <Route path='/account/create'>
        <CreateWallet />
      </Route>
      <Route path='/account/login'>
        <Login />
      </Route>
    </Switch>
  )
}

export default Account
