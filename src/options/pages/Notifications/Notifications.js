import React from 'react'
import { Route,Switch } from 'react-router-dom'

import Activity from './Activity'
import TransactionStatus from './TransactionStatus'

const Notifications = () => {
  return (
    <Switch>
      <Route exact path="/notifications/transaction">
        <TransactionStatus />
      </Route>
      <Route exact path="/notifications/*">
        <Activity />
      </Route>
    </Switch>
  )
}

export default Notifications
