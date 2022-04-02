import React from 'react'
import { useHistory } from 'react-router-dom'
import { Switch, Route, NavLink, Redirect } from 'react-router-dom'

import BackBtn from 'img/popup/back-button.svg'

import Search from './Search'
import CustomToken from './CustomToken'

const tabs = [
  { name: 'Search', to: '/import-token/search' },
  { name: 'Custom Token', to: '/import-token/custom-token' }
]

export const ImportToken = () => {
  const history = useHistory()

  return (
    <div>
      <div
        className="bg-trueGray-100 shadow-md flex items-center"
        style={{ width: '426px', height: '48px' }}
      >
        <BackBtn
          onClick={() => {
            console.log('go back')
            history.goBack()
          }}
          className="w-8.75 h-8.75 ml-3.75 cursor-pointer bg-white bg-opacity-70 rounded-full"
        />
        <div className="ml-6 font-semibold text-lg text-blue-800">Import a Token</div>
      </div>

      <div className="flex sticky font-normal text-base leading-5 text-blue-850">
        {tabs.map((tab, idx) => (
          <NavLink
            key={idx}
            to={tab.to}
            className="w-1/3 h-10.75 flex items-center justify-center cursor-pointer"
            activeClassName="text-blue-800 underline"
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
      <Switch>
        <Route exact path="/import-token/search">
          <Search />
        </Route>
        <Route exact path="/import-token/custom-token">
          <CustomToken />
        </Route>
        <Redirect to="/import-token/search" />
      </Switch>
    </div>
  )
}
