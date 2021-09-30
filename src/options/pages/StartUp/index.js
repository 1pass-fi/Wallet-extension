import React from 'react'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'

import KoiIcon from 'img/finnie-koi-logo-white.svg'

import Welcome from './Welcome'
import Upload from './Upload'
import Import from './Import'
import Create from './Create'

import './index.css'

export default () => {
  return (
    <>
      <Link to="/">
        <KoiIcon className="startup-logo" />
      </Link>

      <Switch>
        <Route path="/create-wallet">
          <Create />
        </Route>
        <Route path="/upload-wallet">
          <Upload />
        </Route>
        <Route path="/import-wallet">
          <Import />
        </Route>
        <Route path="/*">
          <Welcome />
        </Route>
      </Switch>
    </>
  )
}
