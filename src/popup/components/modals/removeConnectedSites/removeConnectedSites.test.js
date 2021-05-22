import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import RemoveConnectedSites from '.'

describe('Test for RemoveConnectedSites component', () => {
  describe('Render without crashing', () => {    
    it('renders correctly', () => {
      const sites = [
        'koi.rocks',
        'app.uniswap.org'
      ]

      const { container } = render(<RemoveConnectedSites sites={sites} accountName={'Account 1'}/>)
      expect(container).toMatchSnapshot()
    })
  })
})
