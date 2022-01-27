import React from 'react'
import { Switch, Route } from 'react-router-dom'


import Activity from './Activity'

const Notifications = () => {
  return (
    <Switch>
      <Route exact path="/notifications/*">
        <Activity />
      </Route>
    </Switch>
  )
}

export default Notifications
