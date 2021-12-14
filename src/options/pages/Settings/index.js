import React from 'react'
import { Route, Switch } from 'react-router'

import Kid from './Kid'
import Gallery from './Gallery'
import Security from './Security'
import About from './About'
import Wallet from './Wallet'

import HasArweave from 'options/shared/hasArweave'

export default () => {
  return (
    <Switch>
      <Route exact path='/v2/settings/security'>
        <Security />
      </Route>
      <Route exact path='/v2/settings/wallet'>
        <Wallet />
      </Route>
      <Route exact path='/v2/settings/gallery'>
        <Gallery />
      </Route>
      <Route exact path='/v2/settings/about'>
        <About />
      </Route>
      <Route path='/v2/settings/*'>
        <HasArweave content='Koii Identity only supports AR wallets.' checkingDefaultAccount={true}>
          <Kid />
        </HasArweave>
      </Route>
    </Switch>
  )
}
