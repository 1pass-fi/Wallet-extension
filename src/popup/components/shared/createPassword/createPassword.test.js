import '@babel/polyfill'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import CreatePassword from '.'

describe('Test for CreatePassword component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<CreatePassword />)
      expect(container).toMatchSnapshot()
    })
  })
})
