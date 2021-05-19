import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import AssetRow from '.'

describe('Test for  AssetRow component', () => {
  describe('Unregistered', () => {
    describe('Render without crashing', () => {
      it('renders correctly', () => {
        const { container } = render(<AssetRow isGrey={true} isKoiWallet={true} name="Asset Name" isRegistered={false} earnedKoi={0} />)
        expect(container).toMatchSnapshot('unregistered')
      })
    })
  })

  describe('Registered', () => {
    describe('Render without crashing', () => {
      it('renders correctly', () => {
        const { container } = render(<AssetRow isGrey={false} isKoiWallet={true} name="Asset Name" isRegistered={true} earnedKoi={0} />)
        expect(container).toMatchSnapshot('registered')
      })
    })
  })
})
