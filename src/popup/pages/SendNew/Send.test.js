import { renderWithPopupProviders } from 'testUtils/renderWithProviders'

import Send from './Send'

jest.mock('./hooks/useMethod', () => {
  return {}
})

jest.mock('./hooks/useSelectedAccount', () => {
  return
})

jest.mock('./hooks/useTokenList', () => {
  return
})

jest.mock('./hooks/useValidate', () => {
  return
})

jest.mock('./SendTokenForm', () => {
  return
})

describe.skip('Send component', () => {
  test('render', () => {
    renderWithPopupProviders(<Send />)
  })
})
