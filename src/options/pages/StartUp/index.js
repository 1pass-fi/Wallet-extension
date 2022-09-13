import React from 'react'
import { Route, Switch } from 'react-router'
import Welcome from 'options/finnie-v2/pages/Onboarding/Welcome'

import './index.css'

export default () => {
  return (
    <>
      {/* <Link to="/">
        <KoiIcon className="startup-logo" />
      </Link> */}

      <Switch>
        <Route path="/*">
          <Welcome />
        </Route>
      </Switch>
    </>
  )
}
