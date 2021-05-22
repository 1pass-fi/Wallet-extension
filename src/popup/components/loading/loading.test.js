import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import Loading from '.'

describe('Test for Loading component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<Loading />)
      expect(container).toMatchSnapshot()
    })
  })
})
