import React from 'react'
import * as redux from 'react-redux'
import { render } from '@testing-library/react'

import Content from './Content'
import CreatePassword from './CreatePassword'

// jest.mock('../hooks/useValidPassword', () =>
//   jest.fn().mockReturnValue({
//     isValidPassword: true,
//     passwordErrorMessage: null
//   })
// )

// jest.mock('../hooks/useMethod', () =>
//   jest.fn().mockReturnValue({
//     generateNewKey: jest.fn(),
//     saveNewKey: jest.fn(),
//     verifyPassword: jest.fn(),
//     importFromSeedphrase: jest.fn()
//   })
// )

describe('Content-onboarding component', () => {
  /* CreatePassword component*/
  describe('CreatePassword component render correctly', () => {
    let mockUseSelector
    beforeEach(() => {
      mockUseSelector = jest.spyOn(redux, 'useSelector')
      mockUseSelector.mockReturnValue({ accounts: [] })
    })

    it('should only render CreatePassword component when step is 0', async () => {
      const content = render(<Content step={0} setStep={jest.fn(() => {})} />)

      expect(content.getByTestId('CreatePassword')).toBeInTheDocument()
      expect(content.queryAllByTestId('CreatePassword')).toHaveLength(1)
      expect(content.queryAllByTestId('AddAKey')).toHaveLength(0)
      expect(content.queryAllByTestId('GetAKey')).toHaveLength(0)
      expect(content.queryAllByTestId('PrepareSavePhrase')).toHaveLength(0)
      expect(content.queryAllByTestId('HiddenPhrase')).toHaveLength(0)
      expect(content.queryAllByTestId('InputPhrase')).toHaveLength(0)
      expect(content.queryAllByTestId('RevealPhrase')).toHaveLength(0)
      expect(content.queryAllByTestId('ImportAKey')).toHaveLength(0)
      expect(content.queryAllByTestId('ImportPhrase')).toHaveLength(0)
    })

    // describe('CreatePassword component when account list is empty', () => {
    //   it('should render CreatePassword correctly')
    // })

    // describe('CreatePassword component when account list is not empty', () => {})

    // Adding more testcase to test CreatePassword component...
  })

  /* AddAKey component*/
  describe('CreatePassword component render correctly', () => {
    it('should only render AddAKey component when step is 1', async () => {
      const content = render(<Content step={1} setStep={jest.fn(() => {})} />)

      expect(content.getByTestId('AddAKey')).toBeInTheDocument()
      expect(content.queryAllByTestId('AddAKey')).toHaveLength(1)
      expect(content.queryAllByTestId('CreatePassword')).toHaveLength(0)
      expect(content.queryAllByTestId('GetAKey')).toHaveLength(0)
      expect(content.queryAllByTestId('PrepareSavePhrase')).toHaveLength(0)
      expect(content.queryAllByTestId('HiddenPhrase')).toHaveLength(0)
      expect(content.queryAllByTestId('InputPhrase')).toHaveLength(0)
      expect(content.queryAllByTestId('RevealPhrase')).toHaveLength(0)
      expect(content.queryAllByTestId('ImportAKey')).toHaveLength(0)
      expect(content.queryAllByTestId('ImportPhrase')).toHaveLength(0)
    })
  })

  // Adding more testcase to test AddAKey component...
})
