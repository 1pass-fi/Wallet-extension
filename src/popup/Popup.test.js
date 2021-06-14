import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import store from 'popup/store'
import React from 'react'

import Popup from './Popup'

describe('Test for Popup component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const mockStore = configureStore([thunk])
      const storeMock = mockStore()

      const { container } = render(<Router><Provider store={store}><Popup /></Provider></Router>)
      expect(container).toMatchSnapshot()
    })
  })
})
