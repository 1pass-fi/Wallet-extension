import '@babel/polyfill'
import { fireEvent, getByText, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import configureStore from 'redux-mock-store'

import { RevealSeedPhraseModal } from '.'

describe('Test for ImportPhraseLockScreen component', () => {
  let container, onReveal, onClose, setError
  beforeEach(() => {
    setError = jest.fn()
    onReveal = jest.fn()
    onClose = jest.fn(),

    container = render(<RevealSeedPhraseModal
      setError={setError}
      onReveal={onReveal}
      onClose={onClose}
    />).container
  })

  describe('renders without crashing', () => {
    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
    })
  })
})
