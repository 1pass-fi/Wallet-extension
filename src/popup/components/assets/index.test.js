import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import Assets from '.'


describe('Test for Assets component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<Assets />)
      expect(container).toMatchSnapshot()
    })
  })
})
