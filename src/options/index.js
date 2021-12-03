import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import './index.css'
import Layout from './layout'
import Home from './pages/Home'
import Details from './pages/Details'
import Create from './pages/Create'
import Collections from './pages/Collections'
import CollectionDetails from './pages/CollectionDetails'
import Settings from './pages/Settings'
import Faucet from './pages/Faucet'
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
          <Route exact path="/v2">
            <SecondVer />
          </Route>
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
              <Route exact path="/faucet">
                <Faucet />
              </Route>
              <Route exact path="/friends">
                <HasArweave
                  content="This feature only supports AR wallets"
                  checkingDefaultAccount={true}
                >
                  <Friends />
                </HasArweave>
              </Route>
              <Route exact path="/collections/:collectionId">
                <CollectionDetails />
              </Route>
              <Route exact path="/collections">
                <HasArweave content="This feature only supports AR wallets">
                  <Collections />
                </HasArweave>
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/success">
                <Success />
              </Route>
              <Route path="*">
                <Home />
              </Route>
            </Switch>

            <Route exact path="/details/:txid">
              <Details />
            </Route>
          </Layout>
        </Switch>
      </Router>
    </Provider>
  )
}

ReactDOM.render(<Gallery />, document.getElementById('root'))
