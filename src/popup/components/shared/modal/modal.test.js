import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import Modal from '.'

describe('Test for  Modal component', () => {
  describe('Render without crashing', () => {
    let container, props, Children

    beforeEach(() => {
      Children = () => <h1 className='children'>Hello</h1>
      props = {
        children: <Children />
      }
      const obj = render(<Modal children={props.children} />)

      container = obj.container
      
    })

    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
    })

    it('renders children', () => {
      expect(container.getElementsByClassName('children')[0].textContent).toEqual('Hello')
    })
  })
})
