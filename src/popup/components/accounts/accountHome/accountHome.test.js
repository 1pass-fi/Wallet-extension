import { createMemoryHistory } from 'history'
import React from 'react'
import '@testing-library/jest-dom'

import AccountHome from '.'
import { TYPE } from 'account/accountConstants'
import { act, render, screen } from 'popup/test-utils'
import { fireEvent } from '@testing-library/react'

describe('AccountHome', () => {
  const accounts = [
    {
      type: TYPE.ARWEAVE,
      address: 'fakeAddress',
      accountName: 'Test account',
    },
    {
      type: TYPE.ARWEAVE,
      address: 'fakeAddress',
      accountName: 'Test account',
    },
  ]

  let history
  beforeEach(() => {
    history = createMemoryHistory()
  })

  it('renders without crashing', () => {
    const { container } = render(<AccountHome />, {
      initialState: { accounts },
      history,
    })

    const globalBtn = container.querySelector('.global-button')

    expect(globalBtn).toBeInTheDocument()
    expect(() => screen.getByRole('form')).toThrow()
    expect(container.querySelectorAll('.wallet-wrapper')).toHaveLength(
      accounts.length
    )
  })

  describe('User clicks global send button', () => {
    describe('Send Koi form is not opening', () => {
      it('opens send form', async () => {
        const { container } = render(<AccountHome />, { history })

        const globalBtn = container.querySelector('.global-button')

        await act(async () => {
          await fireEvent.click(globalBtn)
        })

        expect(history.location.search).toBe('?openSendForm=true')
        expect(container.querySelector('form')).toBeInTheDocument()
      })
    })

    describe('Send Koi form is opening', () => {
      it('removes the search params', async () => {
        const { container } = render(<AccountHome />, { history })

        const globalBtn = container.querySelector('.global-button')

        await act(async () => {
          await fireEvent.click(globalBtn)
          await fireEvent.click(globalBtn)
        })

        expect(history.location).toEqual(
          expect.objectContaining({
            pathname: '/account',
            search: '',
          })
        )
      })
    })
  })

  describe('User clicks to add account', () => {
    it('redirects to welcome', async () => {
      const { container } = render(<AccountHome />, { history })

      const addAccountBtn = container.querySelector('.button')

      await act(async () => {
        await fireEvent.click(addAccountBtn)
      })

      expect(history.location.pathname).toBe('/account/welcome')
    })
  })
})
