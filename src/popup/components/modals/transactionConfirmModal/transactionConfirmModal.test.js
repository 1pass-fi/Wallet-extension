import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import TransactionConfirmModal from '.'

describe('Test for TransactionConfirmModal component', () => {
  describe('Render without crashing', () => {    
    it('renders correctly', () => {
      const { container } = render(<TransactionConfirmModal />)
      expect(container).toMatchSnapshot()
    })
  })
})
