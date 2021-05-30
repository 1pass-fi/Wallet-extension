import '@babel/polyfill'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { Provider } from 'react-redux'
import store from 'popup/store'

import RemoveConnectedSites from '.'

describe('Test for RemoveConnectedSites component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const sites = [
        'koi.rocks',
        'app.uniswap.org'
      ]

      const { container } = render(<Provider store={store}><RemoveConnectedSites sites={sites} accountName={'Account 1'} /></Provider>)
      expect(container).toMatchSnapshot()
    })
  })
})
