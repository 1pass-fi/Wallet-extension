import React from 'react'
import { makeTransfer } from 'actions/koi'
import { TYPE } from 'constants/accountConstants'
import { ERROR_MESSAGE, PATH } from 'constants/koiConstants'
import { createMemoryHistory } from 'history'
import rootReducer from 'popup/reducers'
import { act, fireEvent, render, screen } from 'popup/test-utils'
import { applyMiddleware,createStore } from 'redux'
import thunk from 'redux-thunk'

import '@testing-library/jest-dom/extend-expect'

import SendKoiForm from '.'

jest.mock('services/account', () => {
  return {
    popupAccount: {
      getAccount: jest.fn().mockReturnValue({
        get: {
          balance: jest.fn().mockReturnValue(12.22),
          koiBalance: jest.fn().mockReturnValue(12.22),
        },
      }),
    },
  }
})

jest.mock('actions/koi', () => ({
  makeTransfer: jest.fn(() => ({
    type: 'Fake action',
  })),
}))

describe('SendKoiForm component', () => {
  const accounts = [
    {
      type: TYPE.ARWEAVE,
      address: 'fakeAddress',
      accountName: 'Test account 1',
    },
    {
      type: TYPE.ETHEREUM,
      address: 'fakeAddress',
      accountName: 'Test account',
    },
  ]

  const validFormData = {
    accountName: 'Test account 1',
    selectedToken: 'AR',
    recipient: 'just-a-random-test-recipient',
    amount: 0.0023,
  }

  const chooseAccount = async (accountName) => {
    const accountDropdownBtn = screen.getAllByRole('button')[0]
    await act(async () => {
      await fireEvent.click(accountDropdownBtn)
      await fireEvent.click(screen.getByText(accountName))
    })
  }

  const chooseCurrency = async (selectedToken) => {
    const currencyDropdownBtn = screen.getAllByRole('button')[0]
    await act(async () => {
      await fireEvent.click(currencyDropdownBtn)
      await fireEvent.click(screen.getByText(selectedToken))
    })
  }

  const chooseRecipient = async (recipient) => {
    const recipientInput = screen.getByPlaceholderText(
      'Recipient’s wallet address'
    )
    await act(async () => {
      await fireEvent.change(recipientInput, { target: { value: recipient } })
    })
  }

  const chooseAmount = async (amount) => {
    const amountInput = screen.getByRole('spinbutton')
    await act(async () => {
      await fireEvent.change(amountInput, { target: { value: amount } })
    })
  }

  const fillForm = async ({
    accountName,
    selectedToken,
    recipient,
    amount,
  }) => {
    await chooseAccount(accountName)
    await chooseCurrency(selectedToken)
    await chooseRecipient(recipient)
    await chooseAmount(amount)
  }

  const submitForm = async () => {
    const submitBtn = screen.getByRole('button', { name: /send/i })

    await act(async () => {
      fireEvent.click(submitBtn)
    })
  }

  let store
  let history
  beforeEach(() => {
    history = createMemoryHistory()

    store = createStore(
      rootReducer,
      {
        accounts,
      },
      applyMiddleware(thunk)
    )

    render(<SendKoiForm />, { store, history })
  })

  it('renders without crashing', () => {
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /send token/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Make sure you have the correct wallet address/i)
    ).toBeInTheDocument()
  })

  describe('User fills form', () => {
    describe('User filled the account field', () => {
      it('shows token type field', async () => {
        expect(() => screen.getByPlaceholderText('Select token')).toThrow()

        const dropDownBtn = screen.getAllByRole('button')[0]
        await act(async () => {
          await fireEvent.click(dropDownBtn)
          await fireEvent.click(screen.getByText(accounts[0].accountName))
        })

        expect(screen.getByPlaceholderText('Select token')).toBeInTheDocument()
      })

      describe('User account is AR account', () => {
        it('shows token options of KOII and AR', async () => {
          expect(() => screen.getByPlaceholderText('Select token')).toThrow()

          const dropDownBtn = screen.getAllByRole('button')[0]
          await act(async () => {
            await fireEvent.click(dropDownBtn)
            await fireEvent.click(screen.getByText(accounts[0].accountName))
          })

          const currencyDropDownBtn = screen.getAllByRole('button')[0]
          await act(async () => {
            await fireEvent.click(currencyDropDownBtn)
          })

          expect(screen.getByText('AR')).toBeInTheDocument()
          expect(screen.getByText('KOII')).toBeInTheDocument()
          expect(() => screen.getByText('ETH')).toThrow()
        })
      })

      describe('User account is Ethereum account', () => {
        it('shows token options of ETH only', async () => {
          const dropDownBtn = screen.getAllByRole('button')[0]
          await act(async () => {
            await fireEvent.click(dropDownBtn)
            await fireEvent.click(screen.getByText(accounts[1].accountName))
          })

          const currencyDropDownBtn = screen.getAllByRole('button')[0]
          await act(async () => {
            await fireEvent.click(currencyDropDownBtn)
          })

          expect(screen.getByText('ETH')).toBeInTheDocument()

          expect(() => screen.getByText('AR')).toThrow()
          expect(() => screen.getByText('KOII')).toThrow()
        })
      })
    })

    describe('User chooses to edit account information', () => {
      it('shows back the choose account field and hide the choose token field', async () => {
        const dropDownBtn = screen.getAllByRole('button')[0]
        await act(async () => {
          await fireEvent.click(dropDownBtn)
          await fireEvent.click(screen.getByText(accounts[1].accountName))
        })

        const editBtn = screen.getByTestId('editBtn')
        await act(async () => {
          await fireEvent.click(editBtn)
        })

        expect(
          screen.getByPlaceholderText('Select your account')
        ).toBeInTheDocument()
        expect(() => screen.getByPlaceholderText('Select token')).toThrow()
      })
    })
  })

  describe('User fills then submits form', () => {
    describe('Valid form data', () => {
      it('shows transaction confirm modal', async () => {
        await fillForm({ ...validFormData, selectedToken: 'KOII' })

        await submitForm()
        expect(
          screen.getByText(/Transaction Confirmation/i)
        ).toBeInTheDocument()

        await act(async () => {
          await fireEvent.click(
            screen.getByRole('button', { name: 'No, Go Back' })
          )
        })

        setTimeout(() => {
          expect(() => screen.getByText(/Transaction Confirmation/i)).toThrow()
        }, 0)
      })

      describe('User chooses to make transfer', () => {
        describe('Transfer successfully', () => {
          it('calls makeTransfer and redirect to activity page', async () => {
            await fillForm(validFormData)

            await submitForm()
            expect(
              screen.getByText(/Transaction Confirmation/i)
            ).toBeInTheDocument()

            const sendBtnModal = screen.getAllByRole('button', {
              name: /send AR/i,
            })[1]

            await act(async () => {
              await fireEvent.click(sendBtnModal)
            })

            const userAccount = accounts[0]
            expect(makeTransfer).toHaveBeenCalledWith(
              {
                address: userAccount.address,
                type: userAccount.type,
                id: 0,
                label: userAccount.accountName,
                value: userAccount.accountName,
              },
              Number(validFormData.amount),
              validFormData.recipient,
              validFormData.selectedToken
            )

            // Need set time out to be truthy
            setTimeout(() =>
              expect(history.location.pathname).toBe(PATH.ACTIVITY)
            )
          })
        })
      })
    })

    describe('Invalid form data', () => {
      describe('Empty fields', () => {
        it('shows empty fields error message', async () => {
          await fillForm({ ...validFormData, recipient: '' })

          await submitForm()

          expect(() => screen.getByText(/Transaction Confirmation/i)).toThrow()
          expect(store.getState().error).toEqual(ERROR_MESSAGE.EMPTY_FIELDS)
        })
      })

      describe('Amount less than 0', () => {
        it('shows empty amount invalid message', async () => {
          await fillForm({ ...validFormData, amount: -5 })

          await submitForm()

          expect(() => screen.getByText(/Transaction Confirmation/i)).toThrow()
          expect(store.getState().error).toEqual(ERROR_MESSAGE.INVALID_AMOUNT)
        })
      })

      describe('Not selected account', () => {
        it('shows account not selected error message', async () => {
          await chooseRecipient(validFormData.recipient)
          await chooseAmount(validFormData.amount)

          await submitForm()

          expect(() => screen.getByText(/Transaction Confirmation/i)).toThrow()
          expect(store.getState().error).toEqual(ERROR_MESSAGE.SELECT_ACCOUNT)
        })
      })

      describe('Not selected token', () => {
        it('shows token not selected error message', async () => {
          await chooseAccount(validFormData.accountName)
          await chooseRecipient(validFormData.recipient)
          await chooseAmount(validFormData.amount)

          await submitForm()

          expect(() => screen.getByText(/Transaction Confirmation/i)).toThrow()
          expect(store.getState().error).toEqual(ERROR_MESSAGE.SELECT_TOKEN)
        })
      })

      describe('Amount is zero', () => {
        it('shows warning send zero Koi', async () => {
          await fillForm({ ...validFormData, amount: 0 })

          await submitForm()

          expect(store.getState().error).toEqual(ERROR_MESSAGE.SEND_ZERO_KOI)
        })
      })
    })
  })
})
