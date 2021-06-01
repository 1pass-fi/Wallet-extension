import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import Checkbox from '.'

describe('Test for Checkbox component', () => {
  describe('with empty label', () => {
    it('render correctly', () => {
      const { container } = render(<Checkbox />)
      expect(container).toMatchSnapshot('empty-label')
      const label = container.getElementsByClassName('checkbox-label')
      expect(label.length).toEqual(0)
    })
  }) 

  describe('with non empty label', () => {
    it('render correctly', () => {
      const { container } = render(<Checkbox label='label'/>)
      expect(container).toMatchSnapshot('non-empty-label')
      const label = container.getElementsByClassName('checkbox-label')
      expect(label[0].innerHTML).toEqual('label')
    })
  })

  describe('clicked checkbox ', () => {
    describe('with allow green background on checked', () => {
      it('toogle checkmark visibility states and checkbox background color', () => {
        const { container } = render(<Checkbox greenBackround={true}/>)
        const checkbox = container.querySelector('input')
        const checkMarkIcon = container.getElementsByClassName('check-mark-icon')[0]
        const checkboxStyled = container.getElementsByClassName('checkbox-styled')[0]

        expect(checkMarkIcon.style.visibility).toEqual('hidden')
        expect(checkboxStyled.style.background).toEqual('rgb(255, 255, 255)')
        fireEvent.click(checkbox)
        expect(checkMarkIcon.style.visibility).toEqual('visible')
        expect(checkboxStyled.style.background).toEqual('rgb(155, 231, 196)')
        fireEvent.click(checkbox)
        expect(checkMarkIcon.style.visibility).toEqual('hidden')
        expect(checkboxStyled.style.background).toEqual('rgb(255, 255, 255)')
      })
    })

    describe('with not allow green background on checked', () => {
      it('only toogle checkmark visibility states and not change background color', () => {
        const { container } = render(<Checkbox greenBackround={false}/>)
        const checkbox = container.querySelector('input')
        const checkMarkIcon = container.getElementsByClassName('check-mark-icon')[0]
        const checkboxStyled = container.getElementsByClassName('checkbox-styled')[0]
  
        expect(checkMarkIcon.style.visibility).toEqual('hidden')
        expect(checkboxStyled.style.background).toEqual('rgb(255, 255, 255)')
        fireEvent.click(checkbox)
        expect(checkMarkIcon.style.visibility).toEqual('visible')
        expect(checkboxStyled.style.background).toEqual('rgb(255, 255, 255)')
        fireEvent.click(checkbox)
        expect(checkMarkIcon.style.visibility).toEqual('hidden')
        expect(checkboxStyled.style.background).toEqual('rgb(255, 255, 255)')
      })
    })
  }) 
})
