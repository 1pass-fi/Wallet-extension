import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react'
import Onboarding from 'options/pages/Onboarding/Onboarding'
import { popupBackgroundRequest as request } from 'services/request/popup'
import { renderWithOptionProviders } from 'testUtils/renderWithProviders'

jest.mock('services/account')
jest.mock('utils')
jest.mock('services/request/popup')

const PASSWORD_ERROR = {
  NOT_MATCHING: 'Password does not match',
  NOT_MEET_REQUIREMENT:
    'Secure passwords have at least 8 characters and include uppercase & lowercase letters, numbers, and special characters (e.g. !@#$%).',
  INCORRECT: 'Incorrect password'
}

describe('Onboarding flow', () => {
  describe.skip('Step - Secure Finnie with a password', () => {
    let onboarding
    let password, confirmPassword, termsService, errorPassword, errorConfirmPassword, continueButton

    describe('Create new password', () => {
      beforeEach(() => {
        onboarding = renderWithOptionProviders(<Onboarding />)

        password = onboarding.container.querySelector('#new-password')
        confirmPassword = onboarding.container.querySelector('#confirm-password')
        termsService = onboarding.container.querySelector('#new-password-tos')
        errorPassword = onboarding.getByTestId('error-new-password')
        errorConfirmPassword = onboarding.getByTestId('error-confirm-password')
        continueButton = onboarding.container.querySelector('#log-in-button')
      })

      describe('Passwords do not match', () => {
        it('should display password does not match error message', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'OpenKoi@123' } })
          fireEvent.change(confirmPassword, { target: { value: 'Openkoi@123' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(confirmPassword).toHaveValue('Openkoi@123')

          expect(errorPassword.textContent).toBe('')
          expect(errorConfirmPassword.textContent).toBe(PASSWORD_ERROR.NOT_MATCHING)
        })
      })
      describe('Password does not meet the requirement', () => {
        it('should display password requirement when password contains invalid character', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'OpenKoi¥@123' } })
          fireEvent.change(confirmPassword, { target: { value: 'OpenKoi¥@123' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi¥@123')
          expect(confirmPassword).toHaveValue('OpenKoi¥@123')

          expect(errorPassword.textContent).toBe(PASSWORD_ERROR.NOT_MEET_REQUIREMENT)
          expect(errorConfirmPassword.textContent).toBe('')
        })

        it('should display password requirement when password does not contain uppercase letter', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'openkoi@123' } })
          fireEvent.change(confirmPassword, { target: { value: 'openkoi@123' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('openkoi@123')
          expect(confirmPassword).toHaveValue('openkoi@123')

          expect(errorPassword.textContent).toBe(PASSWORD_ERROR.NOT_MEET_REQUIREMENT)
          expect(errorConfirmPassword.textContent).toBe('')
        })

        it('should display password requirement when password does not contain lowercase letter', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'OPENKOI@123' } })
          fireEvent.change(confirmPassword, { target: { value: 'OPENKOI@123' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OPENKOI@123')
          expect(confirmPassword).toHaveValue('OPENKOI@123')

          expect(errorPassword.textContent).toBe(PASSWORD_ERROR.NOT_MEET_REQUIREMENT)
          expect(errorConfirmPassword.textContent).toBe('')
        })

        it('should display password requirement when password does not contain number character', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'OpenKoi@' } })
          fireEvent.change(confirmPassword, { target: { value: 'OpenKoi@' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@')
          expect(confirmPassword).toHaveValue('OpenKoi@')

          expect(errorPassword.textContent).toBe(PASSWORD_ERROR.NOT_MEET_REQUIREMENT)
          expect(errorConfirmPassword.textContent).toBe('')
        })
        it('should display password requirement when password does not contain special character', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'OpenKoi123' } })
          fireEvent.change(confirmPassword, { target: { value: 'OpenKoi123' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi123')
          expect(confirmPassword).toHaveValue('OpenKoi123')

          expect(errorPassword.textContent).toBe(PASSWORD_ERROR.NOT_MEET_REQUIREMENT)
          expect(errorConfirmPassword.textContent).toBe('')
        })
        it('should display password requirement when password length is less than 8 characters', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'OpKo@1' } })
          fireEvent.change(confirmPassword, { target: { value: 'OpKo@1' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpKo@1')
          expect(confirmPassword).toHaveValue('OpKo@1')

          expect(errorPassword.textContent).toBe(PASSWORD_ERROR.NOT_MEET_REQUIREMENT)
          expect(errorConfirmPassword.textContent).toBe('')
        })
      })
      describe('Terms of service is unchecked', () => {
        it('should display error message to force the user check the checkbox', () => {
          fireEvent.change(password, { target: { value: 'OpenKoi@123' } })
          fireEvent.change(confirmPassword, { target: { value: 'OpenKoi@123' } })
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(confirmPassword).toHaveValue('OpenKoi@123')

          expect(onboarding.queryAllByText('Please accept the Terms of Service')).toHaveLength(1)
          expect(errorPassword.textContent).toBe('')
          expect(errorConfirmPassword.textContent).toBe('')
        })
      })
      describe('Valid passwords', () => {
        it('should create new password successfully and move to next step', () => {
          fireEvent.change(password, { target: { value: 'OpenKoi@123' } })
          fireEvent.change(confirmPassword, { target: { value: 'OpenKoi@123' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(confirmPassword).toHaveValue('OpenKoi@123')

          expect(onboarding.queryAllByText('Please accept the Terms of Service')).toHaveLength(0)
          expect(errorPassword.textContent).toBe('')
          expect(errorConfirmPassword.textContent).toBe('')

          expect(onboarding.getByTestId('AddAKey')).toBeInTheDocument()
        })
      })
    })
    describe('Login with password', () => {
      beforeEach(() => {
        request.wallet.verifyPassword.mockImplementation(async () => {
          return true
        })
      })
      describe('Wrong password', () => {
        it('should display incorrect password error', async () => {
          request.wallet.verifyPassword.mockImplementation(async () => {
            return false
          })
          onboarding = renderWithOptionProviders(<Onboarding />, {
            initialState: { accounts: ['Account#1'] }
          })

          password = onboarding.container.querySelector('#new-password')
          errorPassword = onboarding.getByTestId('error-new-password')
          continueButton = onboarding.container.querySelector('#log-in-button')

          fireEvent.change(password, { target: { value: 'OpenKoi@123' } })
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          await waitFor(() => expect(errorPassword.textContent).toBe('Incorrect password'))
        })
      })
      describe('Correct password', () => {
        it('should be authenticated and move to next step', async () => {
          onboarding = renderWithOptionProviders(<Onboarding />, {
            initialState: { accounts: ['Account#1'] }
          })

          password = onboarding.container.querySelector('#new-password')
          errorPassword = onboarding.getByTestId('error-new-password')
          continueButton = onboarding.container.querySelector('#log-in-button')

          fireEvent.change(password, { target: { value: 'OpenKoi@123' } })
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          await waitFor(() => expect(errorPassword.textContent).toBe(''))
          expect(onboarding.getByTestId('AddAKey')).toBeInTheDocument()
        })
      })
    })
  })
  describe('Step - Create or import a key', () => {
    let onboarding
    describe('Create a key', () => {
      describe.skip('Create AR key', () => {
        describe('Step - Write down your secret phrase', () => {
          beforeAll(() => {
            onboarding = renderWithOptionProviders(<Onboarding />)
            // Move to current step
          })
          describe('Step - Save your Secret Phrase - I am Ready', () => {})
          describe('Step - Save your Secret Phrase - Remind me later', () => {})
        })
      })
      describe('Create non-AR key', () => {
        describe('Step - Write down your secret phrase', () => {
          beforeEach(() => {
            onboarding = renderWithOptionProviders(<Onboarding />)
            // Move to current step
          })
          describe('Step - Save your Secret Phrase - I am Ready', () => {
            describe('Step - Reveal secret phrase', () => {
              describe('Before reveal secret phrase', () => {
                it('should hide the secret phrase', () => {})
              })
              describe('After reveal secret phrase', () => {
                it('should show the secret phrase correctly', () => {})
              })
            })

            describe('Step - Confirm secret phrase', () => {
              describe('Wrong secret phrase', () => {
                it('should ... ', () => {})
              })
              describe('Correct secret phrase', () => {
                it('should create new wallet successfully and move to last step', () => {})
              })
            })
          })
          describe('Step - Save your Secret Phrase - Remind me later', () => {
            it('should create new wallet successfully and move to last step', () => {})
          })
        })
      })
    })
    describe.skip('Import a key', () => {
      describe('Import AR key', () => {
        beforeAll(() => {
          onboarding = renderWithOptionProviders(<Onboarding />)
          // Move to current step
        })
      })
      describe('Import non-AR key', () => {
        beforeAll(() => {
          onboarding = renderWithOptionProviders(<Onboarding />)
          // Move to current step
        })
      })
    })
  })
})
