import React from 'react'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'

import KoiIcon from 'img/finnie-koi-logo-white.svg'

// import Welcome from './Welcome'
import Welcome from 'options/finnie-v2/pages/Onboarding/Welcome'
import Upload from './Upload'
import Import from './Import'
import Create from './Create'

import './index.css'

export default () => {
  return (
    <>
      {/* <Link to="/">
        <KoiIcon className="startup-logo" />
      </Link> */}

      <Switch>
        <Route path="/create-wallet">
          {/* <Create /> */}
          <Welcome />
        </Route>
        <Route path="/upload-wallet">
          {/* <Upload /> */}
          <Welcome />
        </Route>
        <Route path="/import-wallet">
          {/* <Import /> */}
          <Welcome />
        </Route>
        <Route path="/*">
          <Welcome />
        </Route>
      </Switch>
    </>
  )
}
