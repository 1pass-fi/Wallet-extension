import React from 'react'
import { Switch, Route } from 'react-router-dom'

import MainLayout from 'finnie-v2/components/MainLayout'

import Activity from './Activity'

const Notifications = () => {
  return (
    <MainLayout title="Notification Center">
      <Switch>
        <Route exact path="/v2/notifications/*">
          <Activity />
        </Route>
      </Switch>
    </MainLayout>
  )
}

export default Notifications
