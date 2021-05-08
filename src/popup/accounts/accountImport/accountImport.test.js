import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import AccountImport from './index'

describe('Test for AccountImport component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<AccountImport />)
      expect(container).toMatchSnapshot()
    })
  })
})
