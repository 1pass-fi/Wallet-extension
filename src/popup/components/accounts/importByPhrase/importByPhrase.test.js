import '@babel/polyfill'
import { fireEvent, getByText, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { BrowserRouter as Router } from 'react-router-dom'

import store from 'popup/store'

import ImportByPhrase from '.'

const mockStore = configureStore([])

describe('Test for ImportByPhrase component', () => {
  describe('Render without crashing', () => {
    it('renders correctly', () => {
      const { container } = render(
        <Router>
          <Provider store={store}>
            <ImportByPhrase />
          </Provider>
        </Router>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('handleSubmit', () => {
    describe('phrase is empty', () => {
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
              <ImportByPhrase />
            </Provider>
          </Router>
        ).container
      })
      it('dispatch error', () => {
        fireEvent.click(getByText(container, 'Import Wallet'))
        expect(storeMock.getActions().length).toEqual(1)
      })
    })
  })
})
