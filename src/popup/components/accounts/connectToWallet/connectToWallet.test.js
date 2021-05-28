import '@babel/polyfill'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { BrowserRouter as Router } from 'react-router-dom'

jest.mock('utils')

import ConnectToWallet from '.'

const mockStore = configureStore([])

describe('Test for ConnectToWallet component', () => {
  let setErrorMock, storeMock, container

  beforeEach(() => {
    setErrorMock = jest.fn()

    const initState = {
      setError: setErrorMock,
    }

    storeMock = mockStore(initState)

    container = render(
      <Router>
        <Provider store={storeMock}>
          <ConnectToWallet />
        </Provider>
      </Router>
    ).container
  })

  describe('renders without crashing', () => {
    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
    })
  })

  describe('click on check all button and clear checked', () => {
    it('renders correctly', () => {
      const selectAllButton = document.querySelector('.select-all-button')
      const clearAllButton = document.querySelector('.unselect-button')
      const optionButton = document.querySelector('.check-wallet')
      fireEvent.click(selectAllButton)
      expect(container).toMatchSnapshot()
      fireEvent.click(clearAllButton)
      expect(container).toMatchSnapshot()
      fireEvent.click(optionButton)
      expect(container).toMatchSnapshot()
    })
  })

  describe('click on reject button', () => {
    it('renders correctly', () => {
      const rejectButton = document.querySelector('.button.reject')
      fireEvent.click(rejectButton)
      expect(container).toMatchSnapshot()
    })
  })

  describe('click on connect button', () => {
    it('renders correctly', () => {
      const connectButton1 = document.querySelector('.button.connect')
      fireEvent.click(connectButton1)

      const connectButton2 = document.querySelector(
        '.allow-permission .button.connect'
      )
      fireEvent.click(connectButton2)
      expect(container).toMatchSnapshot()
    })
  })
})
