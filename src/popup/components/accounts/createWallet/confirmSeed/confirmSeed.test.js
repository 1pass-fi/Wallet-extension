import '@babel/polyfill'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { BrowserRouter as Router } from 'react-router-dom'
import thunk from 'redux-thunk'

jest.mock('lodash/shuffle', () => (list) => list)

import ConnectToWallet from '.'

const mockStore = configureStore([thunk])

describe('Test for ConnectToWallet component', () => {
  let setErrorMock, storeMock, container, setCreateWalletMock, saveWalletMock

  beforeEach(() => {
    setErrorMock = jest.fn()
    setCreateWalletMock = jest.fn()
    saveWalletMock = jest.fn()

    const initState = {
      setError: setErrorMock,
      setCreateWallet: setCreateWalletMock,
    }

    storeMock = mockStore(initState)

    container = render(
      <Router>
        <Provider store={storeMock}>
          <ConnectToWallet
            password='12345678'
            seedPhrase='fragile narrow pepper warfare aisle average gospel danger quarter warm egg civil'
            saveWallet={saveWalletMock}
          />
        </Provider>
      </Router>
    ).container
  })

  describe('renders without crashing', () => {
    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
    })
  })

  describe('select word in phrase', () => {
    it('renders correctly', () => {
      const unselectedWord = document.querySelector('.unselected-box .word')
      fireEvent.click(unselectedWord)
      expect(container).toMatchSnapshot()
      const selectedWord = document.querySelector('.selected-box .word')
      fireEvent.click(selectedWord)
      expect(container).toMatchSnapshot()
      const submitButton = document.querySelector('.confirm-button')
      fireEvent.click(submitButton)
      expect(container).toMatchSnapshot()
      const cancelButton = document.querySelector('.cancel-icon')
      fireEvent.click(cancelButton)
      expect(container).toMatchSnapshot()
    })
  })

  describe('select all words in phrase', () => {
    it('renders correctly', () => {
      const unselectedWords = document.querySelectorAll('.unselected-box .word')
      for (let i = 0; i < 12; i += 1) {
        fireEvent.click(unselectedWords[i])
      }
      const submitButton = document.querySelector('.confirm-button')
      fireEvent.click(submitButton)
      expect(saveWalletMock).toHaveBeenCalled()
      expect(container).toMatchSnapshot()
    })
  })

  describe('select all words in phrase', () => {
    beforeEach(() => {
      saveWalletMock.mockImplementation(() => {
        throw new Error()
      })
    })

    it('renders correctly', () => {
      const unselectedWords = document.querySelectorAll('.unselected-box .word')
      for (let i = 0; i < 12; i += 1) {
        fireEvent.click(unselectedWords[i])
      }
      const submitButton = document.querySelector('.confirm-button')
      fireEvent.click(submitButton)
      expect(saveWalletMock).toHaveBeenCalled()
    })
  })
})
