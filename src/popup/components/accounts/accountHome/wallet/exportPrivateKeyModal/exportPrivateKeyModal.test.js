import { fireEvent, getByText, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { act } from 'react-dom/test-utils'
import React from 'react'
import { KeyModal } from '.'
import { ERROR_MESSAGE } from 'koiConstants'

describe('Tests for Wallet component', () => {
  let container, getKeyFile, setShowExportKeyModel
  
  beforeEach(() => {
    getKeyFile = jest.fn()
    setShowExportKeyModel = jest.fn()

    container = render(<KeyModal 
      getKeyFile={getKeyFile}
      setShowExportKeyModel={setShowExportKeyModel}
    />).container
  })

  describe('Render correctly', () => {
    it('renders without crashing', () => {
      expect(container).toMatchSnapshot()
    })
  })
})
