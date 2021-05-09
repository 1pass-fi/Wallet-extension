import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import Card from '.'

describe('Test for Card component', () => {
  describe('Render without crashing', () => {
    let outerDiv, container, props, Children

    beforeEach(() => {
      Children = () => <h1>Hello</h1>
      props = {
        children: <Children />,
        className: "extra-class-name"
      }
      const obj = render(<Card children={props.children} className={props.className}/>)

      container = obj.container
      outerDiv = container.querySelector('div')
    })

    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
      expect(outerDiv.className).toEqual('card ' + props.className)
    })

    it('renders children', () => {
      expect(screen.getByRole('h1')).toBeInTheDocument()
    })
  })
})
