import React from 'react'
import Onboarding from 'options/pages/Onboarding/Onboarding'
import { renderWithOptionProviders } from 'testUtils/renderWithProviders'

jest.mock('services/account')
jest.mock('utils')

describe('Onboarding flow', () => {
  describe('Step - Secure Finnie with a password', () => {
    let onboarding

    describe('Create new password', () => {
      beforeAll(() => {
        onboarding = renderWithOptionProviders(<Onboarding />)
      })
      describe('Passwords do not match', () => {
        it('should ...', () => {})
      })
      describe('Password does not meet the requirement', () => {
        it('should ... when password contains invalid character', () => {})
        it('should ... when password does not contain uppercase letter', () => {})
        it('should ... when password does not contain lowercase letter', () => {})
        it('should ... when password does not contain number character', () => {})
        it('should ... when password does not contain special character', () => {})
        it('should ... when password length is less than 8 characters', () => {})
      })
      describe('Terms of service is unchecked', () => {
        it('should ...', () => {})
      })
      describe('Valid passwords', () => {
        it('should create new password successfully and move to next step', () => {})
      })
    })
    describe('Login with password', () => {
      beforeAll(() => {
        onboarding = renderWithOptionProviders(<Onboarding />) // Todo: Init accounts
      })
      describe('Wrong password', () => {
        it('should ...', () => {})
      })
      describe('Correct password', () => {
        it('should be authenticated and move to next step', () => {})
      })
    })
  })
  describe('Step - Create or import a key', () => {
    let onboarding
    describe('Create a key', () => {
      describe('Create AR key', () => {
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
          beforeAll(() => {
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
    describe('Import a key', () => {
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
