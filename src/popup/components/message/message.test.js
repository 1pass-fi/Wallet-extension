import '@babel/polyfill'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'


import ErrorMessage from '.'

describe('Test for ErrorMessage component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<ErrorMessage />)
      expect(container).toMatchSnapshot()
    })
  })
})
