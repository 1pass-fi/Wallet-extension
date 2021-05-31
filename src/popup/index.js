/* istanbul ignore next */
import React from 'react'
import ReactDOM from 'react-dom'
import * as browser from 'webextension-polyfill'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import './index.css'
import Popup from './Popup'
import store from './store'

browser.runtime.sendMessage({ data: 'hello' })

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Popup />
    </Router>
  </Provider>,
  document.getElementById('root')
)
