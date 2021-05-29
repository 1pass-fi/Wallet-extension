import '@babel/polyfill'
import { fireEvent, getByText, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { BrowserRouter as Router } from 'react-router-dom'

import ImportPhraseLockScreen from '.'

const mockStore = configureStore([])

describe('Test for ImportPhraseLockScreen component', () => {
  let setErrorMock, signTransactionMock, storeMock, container
  beforeEach(() => {
    setErrorMock = jest.fn()
    signTransactionMock = jest.fn()

    const initState = {
      setError: setErrorMock,
      signTransaction: signTransactionMock,
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
})
