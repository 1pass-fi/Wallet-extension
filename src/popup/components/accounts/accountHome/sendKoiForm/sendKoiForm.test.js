import '@babel/polyfill'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { Provider } from 'react-redux'
import store from 'popup/store'
import React from 'react'
import SendKoiForm from '.'

import { BrowserRouter as Router } from 'react-router-dom'

describe('Test for SendKoiForm component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<Router><Provider store={store}><SendKoiForm /></Provider></Router>)
      expect(container).toMatchSnapshot()
    })
  })
})
