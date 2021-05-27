import '@babel/polyfill'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { Provider } from 'react-redux'
import store from 'popup/store'
import React from 'react'

import ConfirmSeed from '.'

jest.mock('lodash/shuffle', () => (list) => list)

import { BrowserRouter as Router } from 'react-router-dom'

describe('Test for ConfirmSeed component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(
        <Router>
          <Provider store={store}>
            <ConfirmSeed seedPhrase='fragile narrow pepper warfare aisle average gospel danger quarter warm egg civil' />
          </Provider>
        </Router>
      )
      expect(container).toMatchSnapshot()
    })
  })
})
