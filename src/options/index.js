import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

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

const Gallery = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path='/details/:txid'>
            <Details />
          </Route>
          <Route exact path='/create'>
            <Create />
          </Route>
          <Route exact path='/faucet'>
            <Faucet />
          </Route>
          <Route exact path='/friends'>
            <Friends />
          </Route>
          <Route exact path='/collections/:collectionId'>
            <CollectionDetails />
          </Route>
          <Route exact path='/collections'>
            <Collections />
          </Route>
          <Route path='/settings'>
            <Settings />
          </Route>
          <Route path='*'>
            <Home />
          </Route>
        </Switch>
      </Layout>
    </Router>
  )
}

ReactDOM.render(<Gallery />, document.getElementById('root'))
