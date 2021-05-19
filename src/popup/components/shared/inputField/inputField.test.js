import '@babel/polyfill'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import InputField from '.'

describe('Test for DropFile component', () => {
  describe('Render without crashing', () => {
    let obj, container, props, input, toggleIcon

    beforeEach(() => {
      props = {
        label: 'label',
        value: '',
        onChange: () => { document.body.style.backgroundColor = 'red' },
        placeholder: 'placeholder'
      }
      obj = render(<InputField label={props.label} value={props.value} onChange={props.onChange} placeholder={props.placeholder} />)
      container = obj.container
      input = container.querySelector('input')
      toggleIcon = container.getElementsByClassName('toggle-display')[0]
    })

    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
    })

    it('runs the onChange function when text inputted', () => {
      expect(document.body.style.backgroundColor).not.toEqual('red')
      fireEvent.change(input, { target: { value: 'a' } })
      expect(document.body.style.backgroundColor).toEqual('red')
    })

    it('toggles between type display and password when toggle icon clicked', () => {
      expect(input.type).toEqual('password')
      fireEvent.click(toggleIcon)
      expect(input.type).toEqual('text')
      fireEvent.click(toggleIcon)
      expect(input.type).toEqual('password')
    })
  })
})
