import React from 'react'
import { Route, Switch } from 'react-router'
import HasArweave from 'options/shared/hasArweave'

import About from './About'
import Gallery from './Gallery'
import Kid from './Kid'
import NeedHelp from './NeedHelp'
import Security from './Security'
import Wallet from './Wallet'

export default () => {
  return (
    <Switch>
      <Route exact path="/settings/security">
        <Security />
      </Route>
      <Route exact path="/settings/KID">
        <HasArweave content={chrome.i18n.getMessage('koiiIdentityARSupport')} hasArweaveAccounts={true}>
          <Kid />
        </HasArweave>
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
        <Wallet />
      </Route>
    </Switch>
  )
}
