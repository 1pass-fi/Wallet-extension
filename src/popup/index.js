import React from 'react'
import ReactDOM from 'react-dom'
import * as browser from 'webextension-polyfill'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import Popup from './Popup'

browser.runtime.sendMessage({ data: 'hello' })

ReactDOM.render(<Router><Popup /></Router>, document.getElementById('root'))
