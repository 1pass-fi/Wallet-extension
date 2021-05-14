import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import RemoveAccountModal from '.'

describe('Test for  RemoveAccountModal component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<RemoveAccountModal accountName={'Account 1'} accountID={'12345678901234567890123456789'}/>)
      expect(container).toMatchSnapshot()
    })
  })
})
