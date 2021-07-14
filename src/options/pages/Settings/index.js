import React from 'react'
import { Route, Switch } from 'react-router'

import Kid from './Kid'
import Gallery from './Gallery'
import Security from './Security'

export default () => {
  return (
    <Switch>
      <Route exact path='/settings/security'>
        <Security />
      </Route>
      <Route exact path='/settings/gallery'>
        <Gallery />
      </Route>
      <Route path='*'>
        <Kid />
      </Route>
    </Switch>
  )
}
