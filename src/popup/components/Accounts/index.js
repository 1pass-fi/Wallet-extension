// modules
import React from 'react'
import { Route, Switch } from 'react-router-dom'

// components
import WelcomeScreen from './WelcomeScreen'

const Account = () => {
  return (
    <Switch>
      <Route path="/account/welcome">
        <WelcomeScreen />
      </Route>
    </Switch>
  )
}

export default Account
