import '@babel/polyfill'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router } from 'react-router-dom'
import React from 'react'

import UnlockScreen from '.'

describe('Test for UnlockScreen component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<Router><UnlockScreen /></Router>)
      expect(container).toMatchSnapshot()
    })
  })
})
