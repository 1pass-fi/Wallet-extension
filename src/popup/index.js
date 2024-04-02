import React from 'react'
import ReactDOM from 'react-dom'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import * as browser from 'webextension-polyfill'

import Popup from './Popup'
import store from './store'

import '../tailwind.css'
import './index.css'

/**
 * Temporary workaround for secondary monitors on MacOS where redraws don't happen
 * @See https://bugs.chromium.org/p/chromium/issues/detail?id=971701
 *
 * Copied from: https://stackoverflow.com/questions/56500742/why-is-my-google-chrome-extensions-popup-ui-laggy-on-external-monitors-but-not
 */
if (
  // From testing the following conditions seem to indicate that the popup was opened on a secondary monitor
  window.screenLeft < 0 ||
  window.screenTop < 0 ||
  window.screenLeft > window.screen.width ||
  window.screenTop > window.screen.height
) {
  chrome.runtime.getPlatformInfo(function (info) {
    if (info.os === 'mac') {
      const fontFaceSheet = new CSSStyleSheet()
      fontFaceSheet.insertRule(`
        @keyframes redraw {
          0% {
            opacity: 1;
          }
          100% {
            opacity: .99;
          }
        }
      `)
      fontFaceSheet.insertRule(`
        html {
          animation: redraw 1s linear infinite;
        }
      `)
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, fontFaceSheet]
    }
  })
}

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Toaster
        toastOptions={{
          duration: 5000,
          error: {
            style: {
              width: '300px',
              fontSize: '14px',
              color: '#373765',
            }
          }
        }}
      />
      <Popup />
    </Router>
  </Provider>,
  document.getElementById('root')
)
