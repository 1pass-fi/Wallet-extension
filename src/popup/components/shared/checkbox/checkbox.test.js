import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import Checkbox from '.'

describe('Test for Checkbox component', () => {
  describe('Non-empty label', () => {
    it('render correctly', () => {
      const {container} = render(<Checkbox label='label' />)
      expect(container).toMatchSnapshot('non-empty_label')
    })
  }) 
})
