import '@babel/polyfill'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from 'popup/store'
import React from 'react'

import Assets from '.'


describe('Test for Assets component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<Router><Provider store={store}><Assets /></Provider></Router>)
      expect(container).toMatchSnapshot()
    })
  })
})
