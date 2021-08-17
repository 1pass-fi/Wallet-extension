import React from 'react'
import { Route, Switch } from 'react-router'

import Welcome from './Welcome'
import Upload from './Upload'
import Import from './Import'
import Create from './Create'

export default () => {
  return (
    <Switch>
      <Route path='/create'>
        <Create />
      </Route>
      <Route path='/upload'>
        <Upload />
      </Route>
      <Route path='/import'>
        <Import />
      </Route>
      <Route path='*'>
        <Welcome />
      </Route>
    </Switch>
  )
}
