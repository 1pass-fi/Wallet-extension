import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import Button from '.'

describe('Test for Button component', () => {
  describe('Render without crashing', () => {
    let btn, container, props

    beforeEach(() => {
      props = {
        label: 'Click Me',
        onClick: () => {
          document.body.style.backgroundColor = 'red'
        }
      }
      const obj = render(<Button label={props.label} onClick={props.onClick}/>)

      container = obj.container
      btn = container.querySelector('button')
    })

    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
      expect(btn.textContent).toEqual(props.label)
    })

    it('runs onClick function when clicked', () => {
      expect(document.body.style.backgroundColor).not.toEqual('red')
      fireEvent.click(btn)
      expect(document.body.style.backgroundColor).toEqual('red')
    })
  })
})
