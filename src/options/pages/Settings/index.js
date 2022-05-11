import React from 'react'
import { Route, Switch } from 'react-router'

import Kid from './Kid'
import Gallery from './Gallery'
import Security from './Security'
import About from './About'
import Wallet from './Wallet'
import NeedHelp from './NeedHelp'

import HasArweave from 'options/shared/hasArweave'

export default () => {
  return (
    <Switch>
      <Route exact path="/settings/security">
        <Security />
      </Route>
      <Route exact path="/settings/wallet">
        <Wallet />
      </Route>
      <Route exact path="/settings/gallery">
        <Gallery />
      </Route>
      <Route exact path="/settings/about">
        <About />
      </Route>
      <Route exact path="/settings/need-help">
        <NeedHelp />
      </Route>
      <Route path="/settings/*">
        <HasArweave content="Koii Identity only supports AR wallets.">
          <Kid />
        </HasArweave>
      </Route>
    </Switch>
  )
}
