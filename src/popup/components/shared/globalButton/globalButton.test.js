import '@babel/polyfill'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import GlobalButton from '.'

describe('Test for GlobalButton component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<GlobalButton />)
      expect(container).toMatchSnapshot()
    })
  })
})
