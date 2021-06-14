import '@babel/polyfill'
import { fireEvent, getByText, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { act } from 'react-dom/test-utils'
import React from 'react'
import { ImportByFile } from '.'
import { ERROR_MESSAGE } from 'koiConstants'


describe('Test for ImportByPhrase component', () => {
  let importWalletMock, setErrorMock, container, submitBtn, checkedInput

  beforeEach(() => {
    importWalletMock = jest.fn()
    setErrorMock = jest.fn()

    container = render(
      <ImportByFile importWallet={importWalletMock} setError={setErrorMock}/>
    ).container
    submitBtn = getByText(container, 'Import Wallet')
    checkedInput = document.getElementsByName('checkbox')[0]
  })

  const submitForm = async () => {
    await act(async () => {
      await fireEvent.click(submitBtn)
    })
  }

  const fillForm = async ({ password, passwordConfirm, checked }) => {
    const passwordInput = screen.getByPlaceholderText('Make it unique (min. 8 characters)')
    const passwordConfirmInput = document.getElementsByName('pwdConfirm')[0]
    await act(async () => {
      await fireEvent.change(passwordInput, {
        target: { value: `${password}` },
      })
      await fireEvent.change(passwordConfirmInput, {
        target: { value: `${passwordConfirm}` }
      })
    })
  }

  describe('Render without crashing', () => {
    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
    })
  })

  describe('handleSubmit', () => {
    describe('password length < 8', () => {
      it('calls setError with correct message', async () => {
        await fillForm({
          password: '123',
          passwordConfirm: '',
          checked: false
        })
        await submitForm()
        expect(setErrorMock).toBeCalledWith(ERROR_MESSAGE.PASSWORD_LENGTH)
      })
    })

    describe('passwords do not match', () => {
      it('calls setError with correct message', async () => {
        await fillForm({
          password: '123456789',
          passwordConfirm: '987654321',
          checked: false
        })
        await submitForm()
        expect(setErrorMock).toBeCalledWith(ERROR_MESSAGE.PASSWORD_MATCH)
      })
    })

    describe('unchecked terms of service', () => {
      it('calls setError with correct message', async () => {
        await fillForm({
          password: '123456789',
          passwordConfirm: '123456789',
          checked: false
        })
        await submitForm()
        expect(setErrorMock).toBeCalledWith(ERROR_MESSAGE.CHECKED_TERMS)
      })
    })

    // describe('all validations passed', () => {
    //   it('calls importWallet', async () => {
    //     await fillForm({
    //       password: '123456789',
    //       passwordConfirm: '123456789',
    //       checked: true
    //     })
    //     fireEvent.click(checkedInput)
    //     await submitForm()
    //     expect(importWalletMock).toBeCalled()
    //   })
    // })
  })
})
