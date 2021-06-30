import '@babel/polyfill'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'


import Message from '.'

describe('Test for Message component', () => {
  describe('default type is error', () => {
    describe('Render without crashing', () => {
      it('renders correctly', () => {
        const { container } = render(<Message />)
        expect(container).toMatchSnapshot()
      })
    })
  })

  describe('type is notification', () => {
    describe('Render without crashing', () => {
      it('renders correctly', () => {
        const { container } = render(<Message type='notification'/>)
        expect(container).toMatchSnapshot()
      })
    })
  })
})
