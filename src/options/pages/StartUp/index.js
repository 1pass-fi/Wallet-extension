import React from 'react'
import { Route, Switch } from 'react-router'

import Welcome from './Welcome'
import Upload from './Upload'
import Import from './Import'
import Create from './Create'

import './index.css'

export default () => {
  return (
    <Switch>
      <Route path='/create-wallet'>
        <Create />
      </Route>
      <Route path='/upload-wallet'>
        <Upload />
      </Route>
      <Route path='/import-wallet'>
        <Import />
      </Route>
      <Route path='/*'>
        <Welcome />
      </Route>
    </Switch>
  )
}
