import '@babel/polyfill'
import { fireEvent, getByText, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import configureStore from 'redux-mock-store'

import { Select } from '.'

describe('Test for ImportPhraseLockScreen component', () => {
  let container, options, defaultOption, label, placeholder, className, onChange
  beforeEach(() => {
    options = ['one', 'two']
    defaultOption = 'one'
    label='label'
    placeholder='placeholder'
    className='className'
    onChange=jest.fn()

    container = render(<Select
      options={options}
      defaultOption={defaultOption}
      label={label}
      placeholder={placeholder}
      className={className}
      onChange={onChange}
    />).container
  })

  describe('renders without crashing', () => {
    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
    })
  })
})
