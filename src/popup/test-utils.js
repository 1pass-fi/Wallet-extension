import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { render as rtlRender } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { applyMiddleware,createStore } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers/index'

function render(
  ui,
  {
    history = createMemoryHistory(),
    initialState,
    store = createStore(rootReducer, initialState, applyMiddleware(thunk)),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <Router history={history}>{children}</Router>
      </Provider>
    )
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
export { render }
