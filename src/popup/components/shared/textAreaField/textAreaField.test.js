import '@babel/polyfill'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import TextAreaField from '.'

describe('Test for TextAreaField component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(<TextAreaField />)
      expect(container).toMatchSnapshot()
      const toggleDisplayElement = document.querySelector('.toggle-display')
      fireEvent.click(toggleDisplayElement)
      expect(container).toMatchSnapshot()
    })
  })
})
