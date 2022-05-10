import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import './index.css'
import AppProvider from './provider'
import Welcome from './pages/StartUp/Welcome'
import UploadWallet from './pages/StartUp/Upload'
import ImportWallet from './pages/StartUp/Import'
import CreateWallet from './pages/StartUp/Create'
import FriendReferral from 'options/pages/FriendReferral'

import HasArweave from 'options/shared/hasArweave'

import store from './store'

import NavBar from 'finnie-v2/components/NavBar'

import Collection from 'options/pages/Collection'
import Gallery from 'options/pages/Gallery'
import NFTDetail from 'options/pages/NFTDetail'
import Notifications from 'options/pages/Notifications'
import CollectionDetails from 'options/pages/CollectionDetails'
import SelectNfts from 'options/pages/SelectNfts'

import Success from 'options/pages/StartUp/shared/Success'
import MainLayout from 'finnie-v2/components/MainLayout'
import Settings from 'options/pages/Settings'
import AddressBook from 'options/finnie-v1/components/AddressBook/AddressBook'

const FullView = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppProvider>
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
              <>
                <FriendReferral />
                <AddressBook />
              </>
            </Route>
            <Route exact path="/success">
              <>
                <NavBar />
                <AddressBook />
                <Success />
              </>
            </Route>

            <Route exact path="/collections/:collectionId">
              <HasArweave content={'Please import an Arweave account'}>
                <NavBar />
                <AddressBook />
                <CollectionDetails />
              </HasArweave>
            </Route>

            <MainLayout>
              <AddressBook />
              <Switch>
                <Route exact path="/nfts/:id">
                  <NFTDetail />
                </Route>
                <Route exact path="/settings/*">
                  <div className="flex justify-start" style={{ maxWidth: '100%' }}>
                    <Settings />
                  </div>
                </Route>
                <Route exact path="/collections/create/new-collection">
                  <Collection />
                </Route>
                <Route exact path="/collections/create/select-nft">
                  <HasArweave content={'Please import an Arweave account'}>
                    <SelectNfts />
                  </HasArweave>
                </Route>
                <Route exact path="/collections/edit/select-nft/:collectionId">
                  <HasArweave content={'Please import an Arweave account'}>
                    <SelectNfts />
                  </HasArweave>
                </Route>
                <Route exact path="/collections">
                  <Collection />
                </Route>
                <Route path="/notifications">
                  <Notifications />
                </Route>
                <Route exact path="/gallery">
                  <Gallery />
                </Route>
                <Route path="*">
                  <Gallery />
                </Route>
              </Switch>
            </MainLayout>
          </Switch>
        </AppProvider>
      </Router>
    </Provider>
  )
}

ReactDOM.render(<FullView />, document.getElementById('root'))
