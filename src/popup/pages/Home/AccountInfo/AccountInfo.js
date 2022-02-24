import clsx from 'clsx'
import React from 'react'
import { Switch, Route, NavLink, Redirect } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

import { useParallax } from 'react-scroll-parallax'

import BackBtn from 'img/v2/popup-back-btn.svg'

import Tokens from './Tokens'
import Assets from './Assets'
import Activity from './Activity'

const tabs = [
  { name: 'Assets', to: '/assets' },
  { name: 'Tokens', to: '/tokens' },
  { name: 'Activity', to: '/activity' }
]

const AccountInfo = () => {
  const history = useHistory()

  const a = useParallax({
    translateX: [-100, 0],
    shouldAlwaysCompleteAnimation: true,
    startScroll: 0,
    endScroll: 161
  })

  return (
    <div>
      <div ref={a.ref} className="h-15.25 z-20 w-full bg-white fixed top-13.5">
        <BackBtn
          onClick={() => history.goBack()}
          className="w-8.75 h-8.75 z-20 absolute top-3.25 left-3.75 cursor-pointer"
        />
      </div>
      <div className="sticky top-15.25 shadow-lg h-10.75 z-40 flex items-stretch bg-trueGray-100 text-blue-600 text-base">
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
