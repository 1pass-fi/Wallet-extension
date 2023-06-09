import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'

import Options from './Options'
import store from './store'

import './index.css'
import '../tailwind.css'

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Options /> 
    </Router>
  </Provider>,
  document.getElementById('root')
)
