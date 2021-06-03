import '@babel/polyfill'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import GlobalButton from '.'

describe('Test for GlobalButton component', () => {
  describe('Type send', () => {
    it('renders correctly', () => {
      const { container } = render(<GlobalButton currency='KOI' type='send'/>)
      expect(container).toMatchSnapshot('send-button')
    })
  })

  describe('Type lock', () => {
    it('renders correctly', () => {
      const { container } = render(<GlobalButton type='lock'/>)
      expect(container).toMatchSnapshot('send-button')
    })
  })
})
