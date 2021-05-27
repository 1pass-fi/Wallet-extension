import '@babel/polyfill'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import NotificationMessage from '.'

describe('Test for NotificationMessage component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<NotificationMessage />)
      expect(container).toMatchSnapshot()
    })
  })
})
