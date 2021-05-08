import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
// import koiTools from 'koi_tools'

import './Popup.css'
import Header from './header'
import Account from './accounts/index'

// Load wallet from localstorage
// const koiObj = new koiTools.koi_tools()
const Popup = () => {
  // const [koi, setKoi] = useState(null)

  // useEffect(() => {
  //     // koiObj.wallet = localStorage.getItem('koi-address')

  //     chrome.storage.local.set({ "koi-address": "askdhlasjdksdasdkalsj" }, function () {
  //         chrome.storage.local.get('koi-address', function (result) {
  //             console.log(result['koi-address'])
  //             koiObj.wallet = result['koi-address']
  //             setKoi(koiObj)
  //         });
  //     });

  //     // await chrome.storage.local.set({ "koi-address": "askdhlasjdksdasdkalsj" })
  //     // koiObj.wallet = await chrome.storage.local.get(['koi-address'])


  // }, [])

  return (
    <div className="popup">
      <Router>
        <Header />
        <div className="content">
          <Switch>
            <Route path="/account">
              <Account />
            </Route>
            <Route path="/assets">Assets</Route>
            <Route path="/activity">Activity</Route>
            <Route path="/">
              <Redirect to="/account" />
            </Route>
          </Switch>
        </div>
      </Router>

    </div>
  )
}

export default Popup
