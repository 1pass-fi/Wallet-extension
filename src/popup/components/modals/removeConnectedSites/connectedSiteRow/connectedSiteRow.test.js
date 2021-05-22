import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import ConnectedSiteRow from '.'

describe('Test for ConnectedSiteRow component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<ConnectedSiteRow />)
      expect(container).toMatchSnapshot()
    })
  })
})
