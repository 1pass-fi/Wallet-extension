import clsx from 'clsx'
import React from 'react'
import { Switch, Route, NavLink, Redirect } from 'react-router-dom'

import Tokens from './Tokens'
import Assets from './Assets'
import Activity from './Activity'

const tabs = [
  { name: 'Assets', to: '/assets' },
  { name: 'Tokens', to: '/tokens' },
  { name: 'Activity', to: '/activity' }
]

const AccountInfo = () => {
  return (
    <div className="z-20 bg-trueGray-100 text-blue-600 text-base flex flex-col h-full">
      <div className="shadow-lg h-10.75 flex items-stretch">
        {tabs.map((tab, idx) => (
          <NavLink
            key={idx}
            to={tab.to}
            className={clsx('w-1/3 h-10.75 flex items-center justify-center cursor-pointer')}
            activeClassName="font-semibold bg-lightBlue"
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
      <Switch>
        <Route exact path="/assets">
          <Assets />
        </Route>
        <Route exact path="/activity">
          <Activity />
        </Route>
        <Route exact path="/tokens">
          <Tokens />
        </Route>
        <Redirect to="/tokens" />
      </Switch>
    </div>
  )
}

export default AccountInfo
