import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import Popup from './Popup'

describe('Test for Popup component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<Popup />)
      expect(container).toMatchSnapshot()
    })
  })
})
