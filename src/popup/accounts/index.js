import React from 'react'
import './index.css'
import { Route, Switch } from 'react-router-dom'

import AccountHome from './accountHome'
import AccountImport from './accountImport'
import ImportPhrase from './importByPhrase/index'
import ImportFile from './importByFile/index'
import ImportFileSuccess from './importByFileSuccess/index'

const Account = () => {
  return (
    <Switch>
      <Route exact path='/account'>
        <AccountHome />
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
    </Switch>
  )
}

export default Account
