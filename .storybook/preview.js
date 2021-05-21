import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

import store from 'popup/store'

const customViewports = {
  Popup: {
    name: 'Popup',
    styles: {
      width: '426px',
      height: '600px',
    },
  },
  ...MINIMAL_VIEWPORTS,

};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: customViewports,
    defaultViewport: 'Popup'
  },
  layout: 'fullscreen'
}

export const decorators = [
  (Story) => (
    <Provider store={store}>
      <Router>
        <div style={{ fontFamily: '\'Catamaran\', sans-serif' }}>
          {Story()}
        </div>
      </Router>
    </Provider>
  )
];
