import '@babel/polyfill'
import { fireEvent, getByText, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { act } from 'react-dom/test-utils'
import React from 'react'
import { ImportByPhrase } from '.'
import { ERROR_MESSAGE } from 'koiConstants'


describe('Test for ImportByPhrase component', () => {
  let importWalletMock, setErrorMock, container, form, submitBtn

  beforeEach(() => {
    importWalletMock = jest.fn()
    setErrorMock = jest.fn()

    container = render(
      <ImportByPhrase importWallet={importWalletMock} setError={setErrorMock}/>
    ).container
    submitBtn = getByText(container, 'Import Wallet')
    console.log(document.getElementsByName('inputPhrase')[0].name)
  })

  const submitForm = async () => {
    await act(async () => {
      await fireEvent.click(submitBtn)
    })
  }

  const fillForm = async ({ seedPhrase, password, passwordConfirm, checked }) => {
    const seedPhraseInput = screen.getByPlaceholderText('Paste seed phrase here')
    const passwordInput = screen.getByPlaceholderText('Make it unique (min. 8 characters)')
    const passwordConfirmInput = document.getElementsByName('pwdConfirm')[0]
    const checkedInput = document.getElementsByName('checkbox')[0]
    await act(async () => {
      await fireEvent.change(seedPhraseInput, {
        target: { value: `${seedPhrase}` },
      });
      await fireEvent.change(passwordInput, {
        target: { value: `${password}` },
      });
      await fireEvent.change(passwordConfirmInput, {
        target: { value: `${passwordConfirm}` }
      })
      await fireEvent.change(checkedInput, {
        target: { value: `${checked}` }
      })
    })
  }

  describe('Render without crashing', () => {
    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
    })
  })

  describe('handleSubmit', () => {
    describe('phrase is empty', () => {
      it('calls setError with correct message', async () => {
        await fillForm({
          seedPhrase: '',
          password: '',
          passwordConfirm: '',
          checked: false
        })
        await submitForm()
        expect(setErrorMock).toBeCalledWith(ERROR_MESSAGE.EMPTY_PHRASE)
      })
    })
  })
})
