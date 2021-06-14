import { fireEvent, getByText, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { act } from 'react-dom/test-utils'
import React from 'react'
import { Wallet } from '.'
import { ERROR_MESSAGE } from 'koiConstants'

describe('Tests for Wallet component', () => {
  let container, accountAddress, koiBalance, arBalance, accountName, price, removeWallet, setNotification, setAccountName
  
  beforeEach(() => {
    accountAddress = 'accountAddress'
    koiBalance = 100,
    arBalance = 1000,
    accountName = 'accountName'
    price = { AR: 1, KOI: 2 }
    removeWallet = jest.fn()
    setNotification = jest.fn()
    setAccountName = jest.fn()

    container = render(<Wallet 
      accountAddress={accountAddress}
      koiBalance={koiBalance}
      arBalance={arBalance}
      accountName={accountName}
      price={price}
      setNotification={setNotification}
      setAccountName={setAccountName}
    />).container
  })

  describe('Render correctly', () => {
    it('renders without crashing', () => {
      expect(container).toMatchSnapshot()
    })
  })
})
