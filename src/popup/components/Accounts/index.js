// modules
import React from 'react'
import { Route, Switch } from 'react-router-dom'

// components
import WelcomeScreenNew from './WelcomeScreenNew'

const Account = () => {
  return (
    <Switch>
      <Route path="/account/welcome">
        <WelcomeScreenNew />
      </Route>
    </Switch>
  )
}

export default Account
