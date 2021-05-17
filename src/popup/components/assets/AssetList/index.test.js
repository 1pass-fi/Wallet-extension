import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import AssetList from '.'

const assets = [
  {
    isKoiWallet: true,
    name: 'Astropinx',
    isRegistered: true,
    earnedKoi: 29.373
  }, 
  {
    isKoiWallet: false,
    name: 'AsMercury (The Planets #1)tropinx',
    isRegistered: true,
    earnedKoi: 29.373
  }, 
]

describe('Test for AssetList component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<AssetList assets={assets} />)
      expect(container).toMatchSnapshot()
    })
  })
})
