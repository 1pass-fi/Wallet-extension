import '@babel/polyfill'
import { fireEvent, getByText, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { BrowserRouter as Router } from 'react-router-dom'

import ImportPhraseLockScreen from '.'

jest.mock('./utils')
import * as utils from './utils'

const mockStore = configureStore([])

describe('Test for ImportPhraseLockScreen component', () => {
  let setErrorMock, importWalletMock, storeMock, container
  beforeEach(() => {
    setErrorMock = jest.fn()
    importWalletMock = jest.fn()

    const initState = {
      setError: setErrorMock,
      importWallet: importWalletMock,
    }

    storeMock = mockStore(initState)

    container = render(
      <Router>
        <Provider store={storeMock}>
          <ImportPhraseLockScreen />
        </Provider>
      </Router>
    ).container
  })

  describe('renders without crashing', () => {
    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
    })
  })

  describe('onSubmit', () => {
    it('call validatePhrase', () => {
      const paswordField = document.querySelector('.password .input')
      const confirmPaswordField = document.querySelector(
        '.confirm-password .input'
      )
      const phraseField = document.querySelector('.seed-phrase .input')
      const submitButton = document.querySelector('.unlock-button')

      fireEvent.change(paswordField, { target: { value: '12345678' } })
      fireEvent.change(confirmPaswordField, { target: { value: '12345678' } })
      fireEvent.change(phraseField, {
        target: { value: '1 2 3 4 5 6 7 8 9 0 1 2' },
      })
      fireEvent.click(submitButton)

      expect(utils.validatePhrase).toBeCalled()
    })
  })
})
