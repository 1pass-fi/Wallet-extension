import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import './index.css'
import Layout from './layout'
import Welcome from './pages/StartUp/Welcome'
import UploadWallet from './pages/StartUp/Upload'
import ImportWallet from './pages/StartUp/Import'
import CreateWallet from './pages/StartUp/Create'
import FriendReferral from 'finnie-v2/pages/FriendReferral'

import SecondVer from './finnie-v2'

import HasArweave from 'options/shared/hasArweave'

import store from './store'

const Gallery = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Layout>
            <Switch>
              <Route exact path="/welcome">
                <Welcome />
              </Route>
              <Route exact path="/create-wallet">
                <CreateWallet />
              </Route>
              <Route exact path="/upload-wallet">
                <UploadWallet />
              </Route>
              <Route exact path="/import-wallet">
                <ImportWallet />
              </Route>
              <Route exact path="/friend-referral">
                <FriendReferral />
              </Route>
              <Route path="*">
                <HasArweave content={'Please import an Arweave account'}>
                  <SecondVer />
                </HasArweave>
              </Route>
            </Switch>
          </Layout>
        </Switch>
      </Router>
    </Provider>
  )
}

ReactDOM.render(<Gallery />, document.getElementById('root'))
