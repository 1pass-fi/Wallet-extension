import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import './index.css'
import Layout from './layout'
import Create from './pages/Create'
import Friends from './pages/Friends'
import Welcome from './pages/StartUp/Welcome'
import UploadWallet from './pages/StartUp/Upload'
import ImportWallet from './pages/StartUp/Import'
import CreateWallet from './pages/StartUp/Create'

import SecondVer from '../finnie-v2'

import Success from './pages/StartUp/shared/Success'
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
              <Route exact path="/create">
                <HasArweave content="This feature only supports AR wallets">
                  <Create />
                </HasArweave>
              </Route>
              <Route exact path="/friends">
                <HasArweave
                  content="This feature only supports AR wallets"
                  checkingDefaultAccount={true}
                >
                  <Friends />
                </HasArweave>
              </Route>
              <Route path="/success">
                <Success />
              </Route>
              <Route path="*">
                <SecondVer />
              </Route>
            </Switch>
          </Layout>
        </Switch>
      </Router>
    </Provider>
  )
}

ReactDOM.render(<Gallery />, document.getElementById('root'))
