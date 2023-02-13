import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'

import Options from './Options'
import store from './store'

import './index.css'
import '../tailwind.css'

/* init keepAlive port to prevent service worker to be inactive */
;(function connect() {
  chrome.runtime.connect({name: 'keepAlive'})
    .onDisconnect.addListener(connect)
})()

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Options /> 
    </Router>
  </Provider>,
  document.getElementById('root')
)
