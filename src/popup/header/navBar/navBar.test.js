import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'


import Navbar from './index'

import { BrowserRouter as Router } from 'react-router-dom'

describe('Test for Navbar component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<Router><Navbar/></Router>)
      expect(container).toMatchSnapshot()
    })
  })
})
