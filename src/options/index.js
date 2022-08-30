import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import MainLayout from 'finnie-v2/components/MainLayout'
import NavBar from 'finnie-v2/components/NavBar'
import AddressBook from 'options/finnie-v1/components/AddressBook/AddressBook'
import Welcome from 'options/finnie-v2/pages/Onboarding/Welcome'
import Collection from 'options/pages/Collection'
import CollectionDetails from 'options/pages/CollectionDetails'
import Gallery from 'options/pages/Gallery'
import NFTDetail from 'options/pages/NFTDetail'
import Notifications from 'options/pages/Notifications'
import SelectNfts from 'options/pages/SelectNfts'
import Settings from 'options/pages/Settings'
import Success from 'options/pages/StartUp/shared/Success'
import HasArweave from 'options/shared/hasArweave'

import AppProvider from './provider'
import store from './store'

import './index.css'

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
              {/* <CreateWallet /> */}
              <Welcome />
            </Route>
            <Route exact path="/upload-wallet">
              {/* <UploadWallet /> */}
              <Welcome />
            </Route>
            <Route exact path="/import-wallet">
              {/* <ImportWallet /> */}
              <Welcome />
            </Route>
            {/* <Route exact path="/friend-referral">
              <>
                <FriendReferral />
                <AddressBook />
              </>
            </Route> */}
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
