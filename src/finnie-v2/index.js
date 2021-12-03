import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Gallery from './pages/Gallery'

import './style.css'

const SecondVer = () => {
  return (
    <Switch>
      <Route path="*">
        <Gallery />
      </Route>
    </Switch>
  )
}

export default SecondVer
